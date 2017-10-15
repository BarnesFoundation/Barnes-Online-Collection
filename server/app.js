const express = require('express');
const morgan = require('morgan');
const path = require('path');
const elasticsearch = require('elasticsearch');
const auth = require('http-auth');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');
const htpasswdFilePath = path.resolve(__dirname, '../.htpasswd');
const axios = require('axios');
const BARNES_SETTINGS = {
  size: 50
}
const MORE_LIKE_THIS_FIELDS = [
  "tags.tag.*",
  "tags.category.*",
  "color.palette-color-*",
  "color.average-*",
  "color.palette-closest-*",
  "title.*",
  "people.*",
  "medium.*",
  "shortDescription.*",
  "longDescription.*",
  "visualDescription.*",
  "period",
  "culture.*",
  "curvy",
  "vertical",
  "diagonal",
  "horizontal",
  "light",
  "line",
  "space",
  "light_desc_*",
  "color_desc_*",
  "comp_desc_*",
  "generic_desc_*"
];

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const signedUrlExpireSeconds = 60 * 5;

const app = express();
const esClient = new elasticsearch.Client({
  host: [
    {
      host: process.env.ELASTICSEARCH_HOST,
      auth: `${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}`,
      protocol: process.env.ELASTICSEARCH_PROTOCOL,
      port: process.env.ELASTICSEARCH_PORT
    }
  ]
});

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// redirect http to https
if (process.env.NODE_ENV === "production") {
  app.enable('trust proxy');
  app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    return next();
  });
}


app.get('/health', (req, res) => {
  res.json({ success: true });
});


// if in production, and .htpasswd file exists, set up authentication
if (process.env.NODE_ENV === 'production' && fs.existsSync(htpasswdFilePath)) {
  const basic = auth.basic({
    file: htpasswdFilePath
  });
  app.use(auth.connect(basic));
}

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/objects/:object_id', (req, res) => {
  esClient.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type: "object",
    id: req.params.object_id,
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes._source);
    }
  });
});

app.get('/api/search', (req, res) => {
  console.log('got search')
  const body = req.query.body;
  console.log(body)

  esClient.search({
    index: process.env.ELASTICSEARCH_INDEX,
    body: body,
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes);
    }
  });
});

app.get('/api/related', (req, res) => {
  console.log(req.query)
  const {objectID, similarRatio} = req.query;

  axios
    .get(`/api/objects/${objectID}`)
    .then((response) => {
      console.log(response)
      if (response.hits.hits) {
        const objectToCompare = response.hits.hits[0];
        const objectDescriptors = objectToCompare.sliceFields(MORE_LIKE_THIS_FIELDS)

        let body = bodybuilder()
          .sort('_score', 'desc')
          .filter('exists', 'imageSecret')
          .from(fromIndex)
          .size(1000)
          .query('more_like_this', {
            'like': [
              {
                '_index': process.env.ELASTICSEARCH_INDEX,
                '_type': 'object',
                '_id': objectID
              }
            ],
            'fields': MORE_LIKE_THIS_FIELDS,
            'min_term_freq': 1,
            'minimum_should_match': '1%'
          })
          .build();

        axios
          .get('/api/search', body)
          .then((response) => {
            let objects = [];

            if (response.hits.hits) {
              const distances = response.hits.hits.map(object => {
                MORE_LIKE_THIS_FIELDS.reduce((sum, field) => {
                  return sum + (objectDescriptors[field] - object[field]) ** 2
                }, 0)
              })

              const maxDistance = Math.max(distances);
              const sortedDistances = distances.slice().sort();
              const median = sortedDistances[Math.floor(distances.length/2)]

              let indices = new Set();

              // Add similar items
              while(indices.size < Math.floor(BARNES_SETTINGS.size * similarRatio)) {
                const randomIndex = Math.floor(Math.random() * distances.length)
                if (distances[randomIndex] < median) {
                  indices.add(randomIndex)
                }
              }

              // Add disimilar items
              while(indices.size < BARNES_SETTINGS.size) {
                const randomIndex = Math.floor(Math.random() * distances.length)
                if (distances[randomIndex] > median) {
                  indices.add(randomIndex)
                }
              }

              objects = indices.map(index => response.hits.hits[index])
            }

            res.json(objects)
          })
          .catch((error) => {
            res.json(error)
          });
      }
    })
    .catch((error) => {
      res.json(error)
    });
});

const getSignedUrl = (invno) => {
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET,
    Key: `assets/${invno}.jpg`,
    Expires: signedUrlExpireSeconds
  });
  return url;
}

app.post('/api/objects/:object_invno/download', (req, res) => {
  const field = req.body.field;
  request({
    uri: `https://${process.env.WUFOO_SUBDOMAIN}.wufoo.com/api/v3/forms/${process.env.WUFOO_DOWNLOAD_FORM}/entries.json`,
    method: 'POST',
    auth: {
      username: process.env.WUFOO_USERNAME,
      password: process.env.WUFOO_PASSWORD,
      sendImmediately: false
    },
    form: {
      'Field1': field,
      'Field3': req.params.object_invno
    }
  }, (err, response, body) => {
    const parsedBody = JSON.parse(body);
    if (parsedBody.Success === 1) {
      res.json({url: getSignedUrl(req.params.object_invno)});
    } else {
      res.status(500).json({success: false});
    }
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*/:page', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(function(req, res) {
  res.status(404).send('Page does not exist!');
});


module.exports = app;

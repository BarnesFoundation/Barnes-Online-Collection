const express = require('express');
const bodybuilder = require('bodybuilder');
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
const ALL_MORE_LIKE_THIS_FIELDS = [
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
  "culture.*",
  "period",
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
]
const MORE_LIKE_THIS_FIELDS = [
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
  const options = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'object',
    id: req.params.object_id
  }
  esClient.get(options, function(error, esRes) {
    if (error) {
      console.error(`[error] esClient: ${error.message}`)
      res.json(error)
    } else {
      res.json(esRes._source)
    }
  })
});

app.get('/api/search', (req, res) => {
  esClient.search({
    index: process.env.ELASTICSEARCH_INDEX,
    body: req.query.body,
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes);
    }
  });
});

function getObjectDescriptors(objectID) {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(1)
    .query('match', '_id', objectID)
    .rawOption('_source', MORE_LIKE_THIS_FIELDS)
    .build()

  return axios
    .get(`http://localhost:4000/api/search`, { params: { body } })
    .then(response => {
      const hits = response.data.hits.hits;
      return hits[0]._source
    })
    .catch((error) => {
      console.error(`[error] getObjectDescriptors:`, error.message)
    })
}

function getRelatedObjects(objectID) {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(1000)
    .query('more_like_this', {
      'like': [
        {
          '_index': process.env.ELASTICSEARCH_INDEX,
          '_type': 'object',
          '_id': objectID
        }
      ],
      'fields': ALL_MORE_LIKE_THIS_FIELDS,
      'min_term_freq': 1,
      'minimum_should_match': '10%'
    })
    .build();

  return axios
    .get('http://localhost:4000/api/search', { params: { body } })
    .then(response => response.data.hits.hits)
    .catch((error) => console.error(error.message))
}

app.get('/api/related', (req, res) => {
  const {objectID, similarRatio} = req.query;

  axios
    .all([getObjectDescriptors(objectID), getRelatedObjects(objectID)])
    .then(axios.spread((objectDescriptors, relatedObjects) => {
      const sources = relatedObjects.map(object => object._source)

      const distances = sources.map(source => {
        const keys = Object.keys(source)

        const more_like_this_keys = MORE_LIKE_THIS_FIELDS.map(field => {
          return (field[field.length-1] === '*') ? field.slice(field, field.length-1) : field
        })

        const filtered_keys = keys.filter(key => more_like_this_keys.some(more_like_this_key => key.indexOf(more_like_this_key) === 0 ))

        const descriptor_keys = filtered_keys.filter(key => key in objectDescriptors)

        const distance = descriptor_keys.reduce((sum, key) => {
          const absolute_distance = parseFloat(objectDescriptors[key]) - parseFloat(source[key])
          return sum + (absolute_distance * absolute_distance)
        }, 0)

        const normalized_distance =  distance / descriptor_keys.length

        return normalized_distance
      })

      const sortedDistances = distances.slice().sort();

      const median = sortedDistances[Math.floor(distances.length/2)]

      const max_size = Math.min(BARNES_SETTINGS.size, distances.length)

      const similarItemCount = Math.floor(max_size * similarRatio / 100.0)

      let indices = new Set()
      // Add similar items
      while(indices.size < similarItemCount) {
        const randomIndex = Math.floor(Math.random() * distances.length)
        if (distances[randomIndex] <= median) {
          indices.add(randomIndex)
        }
      }

      // Add disimilar items
      while(indices.size < max_size - 1) {
        const randomIndex = Math.floor(Math.random() * distances.length)
        if (distances[randomIndex] >= median) {
          indices.add(randomIndex)
        }
      }

      const objects = Array.from(indices).map(index => ({ 
        _index: process.env.ELASTICSEARCH_INDEX,
        _type: 'object',
        _id: sources[index].id,
        _score: distances[index],
        _source: sources[index]})
      )

      res.json({hits: {
        total: objects.length,
        hits: objects
      }})
    }))
    .catch((error) => {
      console.error(`[error] axios.all: ${error.message}`);
      res.json(error.message);
    })
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

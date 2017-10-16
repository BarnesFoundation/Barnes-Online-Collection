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
const prerendercloud = require('prerendercloud');
const bodybuilder = require('bodybuilder');
const axios = require('axios');
// using this instead of ejs to template from the express routes after we fetch object data.
// because the webpack compiler is already using ejs.
const Handlebars = require('handlebars');
const canonicalRoot = process.env.REACT_APP_CANONICAL_ROOT || '/';

// todo #switchImportToRequire - consolidate with constants (can't use import yet.)
const META_TITLE = process.env.REACT_APP_META_TITLE || 'Barnes Collection Online';
const metaPlacename = process.env.REACT_APP_META_PLACENAME || '';
const metaDescription = process.env.REACT_APP_META_DESCRIPTION || '';

// todo #switchImportToRequire - consolidate with src/objectDataUtils.js
const generateObjectImageUrls = (object) => {
  const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
  const AWS_PREFIX = process.env.REACT_APP_IMAGES_PREFIX;

  if (!object) {
    return {};
  }

  if (!object.imageSecret) {
    return object;
  }

  const awsUrlWithoutProt = `s3.amazonaws.com/${AWS_BUCKET}/${AWS_PREFIX}`;
  const awsUrl = `https://${awsUrlWithoutProt}`;
  const newObject = Object.assign({}, object);

  newObject.imageUrlSmall = `${awsUrl}/${object.id}_${object.imageSecret}_n.jpg`;
  newObject.imageUrlOriginal = `${awsUrl}/${object.id}_${object.imageOriginalSecret}_o.jpg`;
  newObject.imageUrlForWufoo = `${awsUrlWithoutProt}/${object.id}_${object.imageOriginalSecret}`;
  newObject.imageUrlLarge = `${awsUrl}/${object.id}_${object.imageSecret}_b.jpg`;

  return newObject;
}


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

if (process.env.NODE_ENV === 'production' && process.env.PRERENDER_TOKEN) {
  prerendercloud.set('prerenderToken', process.env.PRERENDER_TOKEN);
  app.use(prerendercloud);
}

// Serve static assets
// let index fall through to the wild card route
app.use(express.static(path.resolve(__dirname, '..', 'build'), { index: false }));


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
  const body = req.query.body;

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


// todo #switchImportToRequire - temp copy, move this / consolidate
const getObject = (id) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25);

  body = body.query('match', '_id', id).build();

  // todo: don't hardcode url
  return axios.get(`${canonicalRoot}/api/search`, {
    params: {
      body: body
    }
  }).then((response) => {
    const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
    const object = objects.find(object => {
      return parseInt(object.id, 10)  ===  parseInt(id, 10);
    });

    return object;
  });
}

const renderApp = (res) => {
  return res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
}

const renderAppObjectPage = (req, res, next) => {
  const objectId = req.params.id;

  let htmlFilePromise = new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '..', 'build', 'index.html'), 'utf8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });

  return getObject(objectId).then((objectData) => {
    const canonicalUrl = canonicalRoot + req.originalUrl;

    if (!objectData.id) {
      throw `bad object Id in url: ${objectId}`;
    }

    objectData = generateObjectImageUrls(objectData);

    htmlFilePromise.then(htmlFileContent => {
      const template = Handlebars.compile(htmlFileContent);

      const html = template({
        metaCanonical: canonicalUrl,
        metaDescription: metaDescription,
        metaPlacename: metaPlacename,
        metaImage: objectData.imageUrlSmall,
        metaTitle: `${META_TITLE} — ${objectData.culture || objectData.people}: ${objectData.title}`,
      });

      res.send(html);
    }).catch(next);
  }).catch((error) => {
    res.status(404).send('Page does not exist!');
  });
}

app.get('/objects/:id', (req, res, next) => {
  if (!req.url.endsWith('/')) {
    res.redirect(301, req.url + '/')
  }

  renderAppObjectPage(req, res, next);
});

app.get('/objects/:id/:panel', (req, res, next) => {
  renderAppObjectPage(req, res, next);
});

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  renderApp(res);
});

app.use(function(req, res) {
  res.status(404).send('Page does not exist!');
});

module.exports = app;

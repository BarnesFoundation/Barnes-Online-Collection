const express = require('express');
const morgan = require('morgan');
const path = require('path');
const elasticsearch = require('elasticsearch');
const auth = require('http-auth');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const request = require('request');
const bodyParser = require('body-parser');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const signedUrlExpireSeconds = 60 * 5;

// temp logging to inspect values on the server
console.log('**** temp logging to inspect values on the server ****');
console.log(process.env);
console.log(process.env.NODE_ENV);
console.log('**** ------- ****');

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

// if in production, set up authentication
if (process.env.NODE_ENV === 'production') {
  const basic = auth.basic({
    file: path.resolve(__dirname, '../.htpasswd')
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

// Always return the main index.html, so react-router render the route in the client
app.get('*/:page', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(function(req, res) {
  res.status(404).send('Page does not exist!');
});


module.exports = app;

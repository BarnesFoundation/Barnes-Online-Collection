const express = require('express');
const morgan = require('morgan');
const path = require('path');
const elasticsearch = require('elasticsearch');
const auth = require('http-auth');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
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
    index: "collection",
    type: "object",
    id: req.params.object_id,
    _sourceExclude: "imageOriginalSecret"
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes._source);
    }
  });
});

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  esClient.search({
    index: "collection",
    q: query,
    _sourceExclude: "imageOriginalSecret"
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes);
    }
  });
});

app.get('/api/objects/:object_invno/original_signed_url', (req, res) => {
  const invno = req.params.object_invno;
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET,
    Key: `assets/${invno}.jpg`,
    Expires: signedUrlExpireSeconds
  });
  res.json({url});
});
 
// Always return the main index.html, so react-router render the route in the client
app.get('*/:page', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(function(req, res) {
  res.status(404).send('Page does not exist!');
});


module.exports = app;
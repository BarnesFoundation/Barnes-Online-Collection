const express = require('express');
const morgan = require('morgan');
const path = require('path');
const elasticsearch = require('elasticsearch');
const auth = require('http-auth');

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


// if in production, set up authentication
if (process.env.NODE_ENV === 'production') {
  const basic = auth.basic({
    file: path.resolve(__dirname, '../.htpasswd')
  });
  app.use(auth.connect(basic));
}

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/objects/:object_id', function (req, res) {
  esClient.get({
    index: "collection",
    type: "object",
    id: req.params.object_id
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
    q: query
  }, function(error, esRes) {
    if (error) {
      res.json(error);
    } else {
      res.json(esRes);
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
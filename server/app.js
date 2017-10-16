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


// todo - temp copy -- move this / consolidate
const getObject = (id) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25);

  body = body.query('match', '_id', id).build();

  // todo: don't hardcode url
  return axios.get('http://localhost:4000/api/search', {
    params: {
      body: body
    }
  }).then((response) => {
    const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
    const object = objects.find(object => {
      return parseInt(object.id, 10)  ===  parseInt(id, 10);
    });

    debugger;
    return object;
  }).catch((e) => {
    // temp catch error and send fake data.
    debugger;
  });
}

const renderApp = (res) => {
  return res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
}

app.get('/objects/:id', (req, res) => {
  console.log('objects/:id');
  const objectId = req.params.id;

  let htmlFilePromise = new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '..', 'build', 'index.html'), 'utf8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });

  console.log(objectId);

  getObject(objectId).then((objectData) => {
    console.log(objectData);

    htmlFilePromise.then(htmlFileContent => {
      // todo: use ejs or something to template the objectData into the the html text.
      res.send(htmlFileContent);
    }).catch(next);
  }).catch((error) => {
    debugger;
  });
});

app.get('/objects/:id/:panel', (req, res) => {
  console.log('objects/:id/:panel');
  // renderApp(res);
  // todo: consolidate with above.
});

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  // todo
  renderApp(res);
});

app.use(function(req, res) {
  res.status(404).send('Page does not exist!');
});

module.exports = app;

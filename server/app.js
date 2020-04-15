const artObjectTitles = require('../src/artObjectTitles.json')
const async = require('async')
const auth = require('http-auth')
const AWS = require('aws-sdk')
const axios = require('axios')
const bodybuilder = require('bodybuilder')
const bodyParser = require('body-parser')
const memoryCache = require('memory-cache')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const request = require('request')
const s3 = new AWS.S3()
const googleUA = require('universal-analytics')
const esClient = require('./utils/esClient');

const htpasswdFilePath = path.resolve(__dirname, '../.htpasswd')

// using this instead of ejs to template from the express routes after we fetch object data.
// because the webpack compiler is already using ejs.
const Handlebars = require('handlebars')
const canonicalRoot = (process.env.REACT_APP_CANONICAL_ROOT || '')
const imageTrackBaseUrl = `/track/image-download/`

// todo #switchImportToRequire - consolidate with constants (can't use import yet.)
const META_TITLE = process.env.REACT_APP_META_TITLE || 'Barnes Collection Online'
const META_PLACENAME = process.env.REACT_APP_META_PLACENAME || ''
const META_DESCRIPTION = process.env.REACT_APP_META_DESCRIPTION || ''
const META_IMAGE = process.env.REACT_APP_META_IMAGE || ''
const DEFAULT_TITLE_URL = process.env.DEFAULT_TITLE_URL || 'barnes-collection-object'

const clamp = (num, min, max) => Math.max(min, Math.min(max, num))

const oneSecond = 1000
const oneDay = 60 * 60 * 24 * oneSecond

const buildSearchAssets = require('../scripts/build-search-assets');

let config = {
	baseURL: process.env.REACT_APP_WWW_URL,
	method: 'get'
};

// Add authentication if running in staging/development
if (process.env.NODE_ENV.toLowerCase() !== 'production') {
	config = { ...config, auth: { username: process.env.WWW_USERNAME, password: process.env.WWW_PASSWORD } };
}

const normalizeDissimilarPercent = (req, res, next) => {
  if (req.query.dissimilarPercent !== undefined) {
    req.query.dissimilarPercent = Math.round(req.query.dissimilarPercent / 10) * 10
  }
  next()
}

const relatedCache = (req, res, next) => {
  if (req.query.cache === 'false') {
    console.log(`skipping cache`)
    next()
  } else {
    const { objectID, dissimilarPercent } = req.query

    const cacheKey = (objectID, dissimilarPercent) => {
      if (objectID === undefined) { throw new Error(`objectID undefined`) }
      return `__cache__api_related_${objectID}_${dissimilarPercent}`
    }

    const key = cacheKey(objectID, dissimilarPercent)
    const body = memoryCache.get(key)
    if (body) {
      res.append('x-cached', true)
      res.send(body)
    } else {
      next()
    }

    // warm cache
    async.each(Array(11).fill().map((_, index) => index * 10), dissimilarity => {
      const key = cacheKey(objectID, dissimilarity)
      if (!memoryCache.get(key)) {
        getRelated(objectID, dissimilarity)
          .then(relatedObject => {
            memoryCache.put(key, relatedObject, oneDay)
          })
      }
    })
  }
}

// todo #switchImportToRequire - consolidate with src/objectDataUtils.js
const generateObjectImageUrls = (object) => {
  // todo: deduplicate #imgUrlLogic
  const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET
  const IMAGES_PREFIX = process.env.REACT_APP_IMAGES_PREFIX
  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || `//s3.amazonaws.com/${AWS_BUCKET}`;
  const imageUrlBase = IMAGES_PREFIX ? `${IMAGE_BASE_URL}/${IMAGES_PREFIX}` : IMAGE_BASE_URL;

  if (!object) {
    return {}
  }

  if (!object.imageSecret) {
    return object
  }

  const imageIdReg = `${object.id}_${object.imageSecret}`
  const imageIdOrig = `${object.id}_${object.imageOriginalSecret}`
  const newObject = Object.assign({}, object)
  const canonicalRootNoProt = canonicalRoot.replace(/^https?\:\/\//i, '')

  // Have it send through this tracking url which will then redirect to the image url
  newObject.imageUrlForWufoo = `${canonicalRootNoProt}${imageTrackBaseUrl}${imageIdOrig}`
  newObject.imageUrlSmall = `${imageUrlBase}/${imageIdReg}_n.jpg`
  newObject.imageUrlOriginal = `${imageUrlBase}/${imageIdOrig}_o.jpg`
  newObject.imageUrlLarge = `${imageUrlBase}/${imageIdReg}_b.jpg`

  return newObject
}

const getIndexHtmlPromise = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '..', 'build', 'index.html'), 'utf8', (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

const BARNES_SETTINGS = {
  size: 50
}

const ALL_MORE_LIKE_THIS_FIELDS = [
  'tags.tag.*',
  'tags.category.*',
  'color.palette-color-*',
  'color.average-*',
  'color.palette-closest-*',
  'title.*',
  'people.*',
  'people',
  'medium.*',
  'shortDescription.*',
  'longDescription.*',
  'visualDescription.*',
  'culture.*',
  'space',
  'light_desc_*',
  'color_desc_*',
  'comp_desc_*',
  'generic_desc_*',
  'period',
  'curvy',
  'vertical',
  'diagonal',
  'horizontal',
  'light'
]

const MORE_LIKE_THIS_FIELDS = [
  'people',
  'generic_desc_*',
  'curvy',
  'vertical',
  'diagonal',
  'horizontal',
  'light',
  'line'
];

const BASIC_FIELDS = [
  "id",
  "title",
  "people",
  "medium",
  "imageOriginalSecret",
  "imageSecret",
];

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

const signedUrlExpireSeconds = 60 * 5

let esIndex = process.env.ELASTICSEARCH_INDEX

const app = express()

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// redirect http to https
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy')
  app.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http') {
      return res.redirect('https://' + req.headers.host + req.url)
    }
    return next()
  })
}

app.get('/health', (req, res) => {
  res.json({ success: true })
})

// if in production, and .htpasswd file exists, set up authentication
if (process.env.NODE_ENV === 'production' && fs.existsSync(htpasswdFilePath)) {
  const basic = auth.basic({
    file: htpasswdFilePath
  })
  app.use(auth.connect(basic))
}

// Serve static assets
// let index fall through to the wild card route
app.use(express.static(path.resolve(__dirname, '..', 'build'), { index: false }))

app.get('/api/latestIndex', (req, res) => {
  res.json(esIndex);
});

app.get('/api/objects/:object_id', (req, res) => {
    const options = {
      index: esIndex,
      type: 'object',
      id: req.params.object_id
    };

    esClient.get(options, function (error, esRes) {
      if (error) {
        console.error(`[error] esClient: ${error.message}`)
        res.json(error)
      } else {
        res.json(esRes._source)
      }
    });
});

app.use('/api/search', (req, res) => {

  // Get the body from a get or post request
  const body = (req.method === 'GET') ? req.query.body : req.body.body;

  esClient.search(
    {
      index: esIndex,
      body: body,
      // _source: 
    },
    (error, esRes) => {
      if (error) {
        res.json(error)
      } else {
        res.json(esRes)
      }
  });
});

function getObjectDescriptors (objectID) {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(1)
    .query('match', '_id', objectID)
    .rawOption('_source', BASIC_FIELDS)
    .build()

  return axios
    .get(`${canonicalRoot}/api/search`, {params: { body }})
    .then(response => {
      const hits = response.data.hits.hits
      const hitSource = hits.length ? hits[0]._source : {}

      return hitSource
    })
    .catch((error) => {
      console.error(`[error] getObjectDescriptors:`, error.message)
      console.error(error)
    })
}

function getRelatedObjects (objectID) {
    let body = bodybuilder()
      .filter('exists', 'imageSecret')
      .from(0).size(25)
      .query('more_like_this', {
        'like': [
          {
            '_index': esIndex,
            '_id': objectID
          }
        ],
        'fields': ALL_MORE_LIKE_THIS_FIELDS,
        'min_term_freq': 1,
        'minimum_should_match': '10%'
      })
      .rawOption('_source', BASIC_FIELDS)
      .build()

    return axios
      .get(`${canonicalRoot}/api/search`, { params: { body } })
      .then(response => response.data.hits.hits)
      .catch(error => console.error(error.message))
};

const getDistance = (from, to) => {
  const fromKeys = Object.keys(from)
  const toKeys = Object.keys(to)
  const commonKeys = fromKeys.filter(key => toKeys.includes(key))

  const descriptorKeys = MORE_LIKE_THIS_FIELDS.map((field) => {
    if (field.match(/(.*)[_-]\*$/)) {
      return field.slice(0, field.length - 1)
    } else if (field.match(/(.*)[.]\*$/)) {
      return field.slice(0, field.length - 2)
    }
    return field
  })

  const distanceKeys = descriptorKeys.filter(descriptorKey => commonKeys.some(commonKey => commonKey.indexOf(descriptorKey) === 0))

  const distance = distanceKeys.reduce((sum, key) => {
    let absoluteDistance = 0
    switch (key) {
      case 'people': absoluteDistance = from[key] === to[key] ? 0 : 100; break
      default: absoluteDistance = parseFloat(to[key]) - parseFloat(from[key]); break
    }
    return sum + Math.pow(absoluteDistance, 2)
  }, 0)

  return distanceKeys.length > 0 ? distance / distanceKeys.length : Infinity
}

const getApiRelated = async (req, res) => {
  const {objectID, dissimilarPercent} = req.query;
  getRelated(objectID, req.x_dissimilar_percent || dissimilarPercent)
    .then(related => {
      res.json(related)
    })
    .catch(error => {
      console.error(`[error] problem with getRelated`)
      console.error(error)
    })
}

const getRelated = (objectID, dissimilarPercent) => {
  if (objectID === undefined) {
    throw new Error(`[error] in getRelated: objectID undefined`);
  }
    const similarPercent = 100 - clamp(dissimilarPercent, 0, 100)
    const similarRatio = similarPercent / 100.0

  return (
    axios
    .all([getObjectDescriptors(objectID), getRelatedObjects(objectID)])
    .then(axios.spread((objectDescriptors, relatedObjects) => {
      const sources = relatedObjects.map(object => {
        const _source = object._source
        Object.assign(_source, {id: parseInt(object._id)})
        return _source
      })

      const sorted = sources.sort((a, b) => getDistance(a, objectDescriptors) - getDistance(b, objectDescriptors))
      const maxSize = Math.min(BARNES_SETTINGS.size, sorted.length)
      const similarItemCount = Math.floor(maxSize * similarRatio)
      const similarItems = sorted.slice(0, similarItemCount)
      const dissimilarItems = sorted.slice(-(maxSize - similarItemCount))
      const objects = similarItems.concat(dissimilarItems).map(object => ({
        _index: esIndex,
        _type: 'object',
        _id: object.id,
        _source: object})
      )

      return {
        hits: {
          total: objects.length,
          hits: objects
        }
      };
    }))
  );
}

app.get('/api/related', normalizeDissimilarPercent, relatedCache, getApiRelated)

const getSignedUrl = (invno) => {
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET,
    Key: `assets/${invno}.jpg`,
    Expires: signedUrlExpireSeconds
  })
  return url
}

app.post('/api/objects/:object_invno/download', (req, res) => {
  const field = req.body.field
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
    if (err) res.status(500).json({success: false})
    const parsedBody = JSON.parse(body)
    if (parsedBody.Success === 1) {
      res.json({url: getSignedUrl(req.params.object_invno)})
    } else {
      res.status(500).json({success: false})
    }
  })
})

// todo #switchImportToRequire - temp copy, move this / consolidate
const getObject = (id) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25)

  body = body.query('match', '_id', id).build()

  return axios.get(`${canonicalRoot}/api/search`, {
    params: {
      body: body
    }
  }).then((response) => {
    const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }))
    const object = objects.find(object => {
      return parseInt(object.id, 10) === parseInt(id, 10)
    })

    return object
  })
}

const renderAppObjectPage = (req, res, next) => {
  const objectID = req.params.id
  const htmlFilePromise = getIndexHtmlPromise()

  return getObject(objectID).then((objectData) => {
    const canonicalUrl = canonicalRoot + req.originalUrl

    if (!objectData.id) {
      throw new Error(`bad object ID in url: ${objectID}`)
    }

    objectData = generateObjectImageUrls(objectData)

    htmlFilePromise.then(htmlFileContent => {
      const template = Handlebars.compile(htmlFileContent)

      const artistOrCulture = objectData.culture || objectData.people
      const metaTitle = `${META_TITLE} — ${artistOrCulture}: ${objectData.title}`
      const metaImage = objectData.imageUrlSmall
      const metaDescription = `Barnes Foundation Collection: ${artistOrCulture}. ${objectData.title} -- ${META_DESCRIPTION}`

      const html = template({
        metaCanonical: canonicalUrl,
        metaDescription: metaDescription,
        metaPlacename: META_PLACENAME,
        metaImage: metaImage,
        metaTitle: metaTitle
      })

      res.send(html)
    }).catch(next)
  }).catch(error => {
    console.error(`[error] ${error.message}`)
    res.status(404).send('Page does not exist!')
  })
}

const getCorrectTitleUrl = (id, titleSlug) => {
  return `/objects/${id}/${titleSlug}/`
}

const renderAppLandingPage = (req, res, next) => {
  const htmlFilePromise = getIndexHtmlPromise()
  const canonicalUrl = canonicalRoot + '/'

  htmlFilePromise.then(htmlFileContent => {
    const template = Handlebars.compile(htmlFileContent)

    const html = template({
      metaCanonical: canonicalUrl,
      metaDescription: META_DESCRIPTION,
      metaPlacename: META_PLACENAME,
      metaImage: META_IMAGE,
      metaTitle: META_TITLE
    })

    res.send(html)
  }).catch(next)
}

const getTitleSlug = (id) => {
  const objectTitleData = artObjectTitles[id] || {}
  const slug = objectTitleData.slug || DEFAULT_TITLE_URL

  return slug
}

app.get('/', (req, res, next) => {
  renderAppLandingPage(req, res, next)
})

app.get('/objects', (req, res, next) => {
  // let /objects/? render the home page with a search query.
  // but if the query is empty, redirect home.
  const query = req.query
  const hasQueryKeys = Object.keys(query).length > 0

  if (!hasQueryKeys) {
    return res.redirect(301, '/')
  }

  return renderAppLandingPage(req, res, next)
})

app.get('/objects/:id', (req, res, next) => {
  const titleSlug = getTitleSlug(req.params.id)
  // account for slash at end
  const newUrl = req.url.replace(/[/]*$/i, `/${titleSlug}/`)

  return res.redirect(301, newUrl)
})

// special case redirect to handle old url formats
app.get('/objects/:id/ensemble', (req, res, next) => {
  const titleSlug = getTitleSlug(req.params.id)

  // target the end of the url with an optional slash (or slashes)
  const newUrl = req.url.replace(/ensemble[/]*$/i, `${titleSlug}/ensemble`)

  return res.redirect(301, newUrl)
})

// special case redirect to handle old url formats
app.get('/objects/:id/details', (req, res, next) => {
  const titleSlug = getTitleSlug(req.params.id)
  // target the end of the url with an optional slash (or slashes)
  const newUrl = req.url.replace(/details[/]*$/i, `${titleSlug}/details`)

  return res.redirect(301, newUrl)
})

app.get('/objects/:id/:title', (req, res, next) => {
  if (!req.url.endsWith('/')) {
    return res.redirect(301, req.url + '/')
  }

  const titleSlug = getTitleSlug(req.params.id)

  if (titleSlug !== req.params.title) {
    // redirect to the correct title
    const redirectUrl = getCorrectTitleUrl(req.params.id, titleSlug)
    return res.redirect(301, redirectUrl)
  }

  renderAppObjectPage(req, res, next)
})

app.get('/objects/:id/:title/:panel', (req, res, next) => {
  const titleSlug = getTitleSlug(req.params.id)

  if (titleSlug !== req.params.title) {
    // redirect to the correct title
    const redirectUrl = getCorrectTitleUrl(req.params.id, titleSlug) + `${req.params.panel}`
    return res.redirect(301, redirectUrl)
  }

  renderAppObjectPage(req, res, next)
})


// e.g. /track/image-download/5610_014b0a151d1954e6_o.jpg
// bucket and prefix needs to be dealt with...
app.get(`${imageTrackBaseUrl}:imageId`, (req, res) => {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL
  const imageBucket = process.env.REACT_APP_AWS_BUCKET
  const imageBucketPrefix = process.env.REACT_APP_IMAGES_PREFIX
  const imageId = req.params.imageId
  const downloadUrl = `${imageBaseUrl}/${imageId}`
  const visitor = googleUA(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

  // console.log('todo: track download for imageId: ' + imageId)
  visitor.pageview(req.url, function (err) {
    if (err) {
      throw new Error(`Error while tracking page view ${err}`)
    }

    // console.log('redirecting to: ' + downloadUrl)
    return res.redirect(302, downloadUrl)
  }).send()
})

/** Endpoint for generating the assets file for the frontend */
app.use('/api/build-search-assets', async (req, res) => {
	const result = await buildSearchAssets.generateAssets();
	res.json(result);
});

/** Stores the entries to be displayed in a cache */
const entryCache = async (request, response) => {
	const key = `__cache__api_craft__entries`;
	const body = memoryCache.get(key);

	if (body) {
		response.append('x-cached', true);
		response.send(body);
	}
	else { 
		const entries = await getEntries();
		response.json(entries);
		memoryCache.put(key, entries, oneDay);
	 }
}

/** Returns the entries from the main Craft site */
const getEntries = () => {
	return new Promise( async(resolve) => {
		
		// Request for fetching entry
		const entryRequest = (slug) => {
			return axios(`/api/entry?slug=${slug}`, config);
		};

		// Fetch all in parallel
		const entries = (await Promise.all([entryRequest('the-barnes-collection'), entryRequest('library-archives'), entryRequest('the-barnes-arboretum')])).map((response) => response.data);

		resolve(entries);
	});
}


/** Endpoint for retrieving entries from the www Craft site */
app.get('/api/entries', entryCache);

/** Endpoint for auto-suggest functionality from the www Craft site */
app.get('/api/suggest', async (request, response) => {
  const { q } = request.query;
  const aConfig = { ...config, url: `/api/suggest?q=${q}`  };
	response.json((await axios(aConfig)).data);
});

/** Get autosuggest functionality for artists in advaned filters. */
app.get('/api/advancedSearchSuggest', async (request, response) => {
  const { q: query } = request.query;

  const { aggregations: { people: { buckets }}} = await esClient.search({
    body: {
      "size": 0,
      "query": {
          "bool" : {
              "filter" : {
                "exists" : {
                  "field" : "imageSecret"
                }
              },
              "must": {
                "multi_match": {
                  "query" : query,
                  "type" : "bool_prefix",
                  "fields": ["people", "people.text", "people.suggest"]
                }
              }
          }
      },
      "_source" : ["id", "title", "people"],
      "aggregations": {
        "people": {
          "terms" : {
            "field" : "people.text",
            "size" : 200
          }
        }
      }
    }
  });

  // Wrap return results in <strong> tags.
  const highlighted = buckets.map(({ key, doc_count }) => {
    const queryIndex = key.toLowerCase().indexOf(query.toLowerCase()); // In case query is LikE thIS.

    const start = key.slice(0, queryIndex);
    const middle = key.slice(queryIndex, queryIndex + query.length);
    const end = key.slice(queryIndex + query.length);

    return ({
      key: `${start}<strong>${middle}</strong>${end}`,
      doc_count: doc_count,
      raw: key, // For when filter is applied.
    });
  });

  response.json({ collectionAdvancedSearch: highlighted });
})

app.use(function (req, res) {
  res.status(404).send('Error 404: Page not Found')
})

app.use(function (error, req, res, next) {
  if (error) console.error(error)
  res.status(500).send('Error 500: Sorry, something went wrong.')
})

module.exports = app

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const slugify = require('slugify')

const sitemapFilePath = path.resolve(__dirname, '../public/sitemap.xml')
const apiUrl = 'https://collection.barnesfoundation.org/api/search'
const apiRequestBody = {
  // only include the title, not the whole source
  "_source": {
    "includes": [
      "title"
    ]
  },
  "from": 0,
  // Return all the objects.
  // 10,000 is the max allowed Elastic Search query size without pagination.
  // The current set length is 1813. And the barnes collection size is not expected to change.
  // So this should be fine to just hard code it.
  "size": 10000,
  "sort": [{
    "_score": {
      "order": "asc"
    }
  }],
  // require both the imageSecret and ensembleIndex to exist.
  "query": {
    "bool": {
      "must": [{
        "exists": {
          "field": "imageSecret"
        }
      }, {
        "exists": {
          "field": "ensembleIndex"
        }
      }]
    }
  }
}

const isoTimestamp = new Date().toISOString()
const sitemapTemplateHeader = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
const sitemapTemplateFooter = '</urlset>'

const getSitemapTemplatePerUrl = (url) => {
  return `` +
    `<url>\n` +
    `<loc>${url}</loc>\n` +
    `<lastmod>${isoTimestamp}</lastmod>\n` +
    `<changefreq>weekly</changefreq>\n` +
    `<priority>0.5</priority>\n` +
    `</url>\n` +
    ``
}

const getSitemapTemplatePerObject = (object) => {
  const slug = slugify(object.title)

  const urlObjectRoot = `https://collection.barnesfoundation.org/objects/${object.id}/${slug}`
  const urlObjectPage = `${urlObjectRoot}/`
  const urlObjectPageEnsemble = `${urlObjectRoot}/ensemble`
  const urlObjectPageDetails = `${urlObjectRoot}/details`

  return `` +
    `${getSitemapTemplatePerUrl(urlObjectPage)}` +
    `${getSitemapTemplatePerUrl(urlObjectPageEnsemble)}` +
    `${getSitemapTemplatePerUrl(urlObjectPageDetails)}` +
    ``
}

const templateSitemapXml = (objects) => {
  const body = objects.map((obj) => {
    return getSitemapTemplatePerObject(obj)
  }).join('')

  console.log(`Templating ${objects.length} objects into the sitemap...`)

  return `` +
    `${sitemapTemplateHeader}` +
    `${body}` +
    `${sitemapTemplateFooter}` +
    ``
}

const writeSitemapFile = (xmlText, onSuccess) => {
  fs.writeFile(sitemapFilePath, xmlText, (err) => {
    if(err) {
      return logError(err)
    }

    onSuccess()
  })
}

const logError = (errorMsg) => {
  console.log('Oops, Something went wrong while trying to build the sitemap.')
  console.log(errorMsg)
}

const fetchArtObjectData = () => {
  return axios
    .get(apiUrl, {params: { body: apiRequestBody }})
    .catch((error) => {
      logError(error.message)
    })
}

const processArtObjectData = (response) => {
  const hits = response.data.hits.hits

  const objects = hits.map(object => Object.assign({}, object._source, { id: object._id }))
  return objects
}

// process it
fetchArtObjectData().then(response => {
  const objects = processArtObjectData(response)
  const sitemapXml = templateSitemapXml(objects)

  writeSitemapFile(sitemapXml, () => {
    // log success
    console.log('Sitemap updated in public/sitemap.xml 👍')
  })
})

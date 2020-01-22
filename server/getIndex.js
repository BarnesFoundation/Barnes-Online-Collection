/*
REMOVED => Our Elastic Search index is now provided via an environment variable,
so we don't need logic to identify the pertinent index.

const getIndex = function (callback) {
  if (esIndex !== null && typeof esIndex === 'string' && esIndex.length > 0) { return callback(null, esIndex) }

  async function hasTags (client, index) {
    return client
      .search({index, body: {query: {bool: {must: [
        {exists: {field: 'tags.*.*'}},
        {exists: {field: 'space'}}
      ]}}}, size: 0})
      .then(result => {
        return result.hits.total > 0
      })
  }

  async function find (client, indices, predicate) {
    let check = false
    let result = null
    for (let index of indices) {
      check = await predicate(client, index)
      if (check) {
        result = index
        break
      }
    }
    return result
  }

  async function getFirstIndexWithTags (indices) {
    const latestIndexWithTags = await find(esClient, indices.split('\n'), hasTags)
    return latestIndexWithTags
  }

  return esClient.cat
    .indices({index: 'collection_*', s: 'creation.date:desc', h: ['i']})
    .then(getFirstIndexWithTags)
    .then(idx => {
      esIndex = idx;
      return callback(null, idx)
    })
}
*/
const esClient = require("../utils/esClient");
const { fixDiacritics } = require("../utils/fixDiacritics");

let esIndex = process.env.ELASTICSEARCH_INDEX;

const performSearch = async (body) => {
  return esClient.search({
    index: esIndex,
    body: body,
    // _source:
  });
};

const search = async (searchQuery) => {
  try {
    const searchResponse = await performSearch(searchQuery);
    return searchResponse;
  } catch (error) {
    return error;
  }
};

const getObjectById = async (objectId) => {
  const options = {
    index: esIndex,
    type: "object",
    id: objectId,
  };

  return await new Promise((resolve) => {
    esClient.get(options, function (error, esRes) {
      if (error) {
        console.error(`[error] esClient: ${error.message}`);
        return resolve(error);
      }
      return resolve(esRes._source);
    });
  });
};

module.exports = {
  search,
  getObjectById,
  performSearch,
};

const ElasticSearchService = require("../services/elasticSearchService");

const LOG_PREFIX = `[NetXSyncJob]`;

function generateQueryInput({ start, end }) {
  return {
    body: {
      sort: [
        {
          _id: {
            order: "asc",
          },
        },
      ],
      from: 0,
      size: 100,
      _source: ["_id", "id", "invno", "imageOriginalSecret", "imageSecret"],
      query: {
        bool: {
          filter: {
            exists: {
              field: "imageSecret",
            },
          },
        },
      },
    },
  };
}

/** Retrieves the Object IDs and Invno Numbers for all objects available in our ElasticSearch database
 * We're retrieving these from ElasticSearch because ElasticSearch is the source against which our Collection Site
 * performs queries against.
 *
 * While we do source and populate our ElasticSearch database using data from NetX, it is ultimately the Artwork records
 * that exist in ElasticSearch that are the dataset we filter and query against to shown on the Collection Site.
 *
 * Therefore, it makes sense to retrieve the Object IDs list from there, and then use it to query against NetX
 */
async function main() {
  const totalRecordCount = await ElasticSearchService.getCount();
  console.debug(`
    ${LOG_PREFIX} There are a total of ${totalRecordCount} records in ElasticSearch
    `);

  const recordBatchSize = 250;
  const numberOfBatches = Math.ceil(totalRecordCount / recordBatchSize);
  console.debug(
    `Job will process ${recordBatchSize} in ${numberOfBatches} batches `
  );

  for (let i = 0; i <= recordBatchSize; i++) {
    const offset = i * recordBatchSize;
    const queryForSet = generateQueryInput({ start: i, end: offset }).body;
    const esResponse = await ElasticSearchService.search(queryForSet);
    const artworkRecords = esResponse.hits.hits.map((item) => item._source);
    console.log(artworkRecords);
  }
}

const NetXSyncJob = {
  main,
};

module.exports = {
  NetXSyncJob,
};

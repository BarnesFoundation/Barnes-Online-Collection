const ElasticSearchService = require("../services/elasticSearchService");
const ObjectAssetService = require("../services/objectAssetService");
const { DAMSService } = require("../services/damsService");

const LOG_PREFIX = `[NetXSyncJob]`;

function generateQueryInput({ start, size }) {
  return {
    body: {
      sort: [
        {
          _id: {
            order: "asc",
          },
        },
      ],
      from: start,
      size: size,
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
  console.log(`
    ${LOG_PREFIX} There are a total of ${totalRecordCount} records in ElasticSearch
    `);

  const recordBatchSize = 250;
  const numberOfBatches = Math.ceil(totalRecordCount / recordBatchSize);
  console.log(
    `Job will process ${recordBatchSize} in ${numberOfBatches} batches `
  );

  for (let i = 0; i <= numberOfBatches; i++) {
    const offset = i * recordBatchSize;
    const queryForSet = generateQueryInput({
      start: offset,
      size: recordBatchSize,
    }).body;

    // Query ElasticSearch for this set of artwork records
    const esResponse = await ElasticSearchService.search(queryForSet);
    const artworkRecords = esResponse.hits.hits;

    // Call the `ObjectAssetService.getAssetsForArtworks` call. This will ensure we're
    // retrieving the assets for the artworks from NetX, and caching them for the next time
    // we need to access them
    await ObjectAssetService.getAssetsForArtworks(artworkRecords);
  }
  console.log(`Completed caching of ${totalRecordCount} artwork records`);

  // Get the archive assets - there's less than a couple hundred of them
  const archiveAssetsMap = await DAMSService.getAllArchiveAssets();
  console.log(
    `Beginning caching of ${
      Object.keys(archiveAssetsMap).length
    } archive assets into the artwork cache`
  );

  // Iterate through the map using the Object Number the asset is for
  // Find the current cached artwork list and add the archive assets to it
  Object.entries(archiveAssetsMap).forEach(([objectNumber, archiveAssets]) => {
    // Look up the pre-existing assets for the object number and augment with archive assets
    const cachedArtwork = ObjectAssetService.getArtworkFromCache(objectNumber);
    const artworksWithArchiveAssets = [...cachedArtwork, ...archiveAssets];

    // Set them into the cache
    ObjectAssetService.setArtworkInCache(
      objectNumber,
      artworksWithArchiveAssets
    );
  });
  console.log(`Completed addition of archive assets into artwork cache`);
}

const NetXSyncJob = {
  main,
};

module.exports = {
  NetXSyncJob,
};

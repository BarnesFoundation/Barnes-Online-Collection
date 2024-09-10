/** Service responsible for fetching from the NetX DAMS to retrieve asset information for
 * artwork and archival objects in the Barnes Collection
 */
const axios = require("axios");

const {
  generateGetAssetsByFolderQuery,
  generateGetFolderByPathQuery,
  generateGetAssetsByQuery: generateGetAssetsBySearchQuery,
  generateGetAssetsByFileNameQuery,
} = require("./queries");

const { transformInvno } = require("../../utils/transformInvno");
const { splitArray } = require("../../utils/splitArray");
const {
  sortAssets,
  groupAssets,
  getValueFromNetXAttribute,
  getImageURLFromRendition,
} = require("./utils");

const NETX_API_TOKEN = process.env.NETX_API_TOKEN;
const NETX_BASE_URL = process.env.REACT_APP_NETX_BASE_URL;
const NETX_ENABLED =
  (process.env.REACT_APP_NETX_ENABLED === "false" ? false : true) || false;

async function makeNetXRequest(query) {
  const response = await axios({
    baseURL: NETX_BASE_URL,
    url: "/api/rpc",
    method: "POST",
    headers: {
      Authorization: `apiToken ${NETX_API_TOKEN}`,
    },
    data: query,
  });

  return response;
}

async function getAssetByObjectNumber(rawObjectNumber) {
  // In case we want to disable interaction with NetX for now
  if (NETX_ENABLED === false) {
    return [];
  }

  // Handle some edge-case where the object number is not valid
  if (!rawObjectNumber) {
    return [];
  }

  // We need to transform the object number because it is formatted
  // differently in the folder paths in NetX
  const objectNumber = transformInvno(rawObjectNumber);

  // We'll check to see if we there exists a sub-folder
  // for this Object Number at the below folder path
  const folderQueryResponse = await makeNetXRequest(
    generateGetFolderByPathQuery(objectNumber)
  );
  const result = folderQueryResponse.data.result || null;

  // This means there's no assets for the provided Object Number
  if (result === null) {
    return [];
  }

  // Otherwise, the assets are existent at the path
  // So we can use the `getAssetsByFolder` query to retrieve the assets
  const assetQueryResponse = await makeNetXRequest(
    generateGetAssetsByFolderQuery(result.id)
  );

  const assets = sortAssets(assetQueryResponse.data.result.results);
  return assets;
}

async function getAssetsByObjectIds(objectIds) {
  /** Inner function for allowing for chunking of the requests
   * to NetX for fetching assets by search query - since it currently
   * seems like anything more than 100 object ids requested in a single
   * query causes NetX to error out
   */
  async function getAssetsByObjectIdsInner(objectIdChunk) {
    try {
      const assetQueryResponse = await makeNetXRequest(
        generateGetAssetsBySearchQuery(objectIdChunk)
      );

      return assetQueryResponse.data.result.results;
    } catch (error) {
      console.error(
        `[DAMSService][getAssetsByObjectIdsInner] Failed getting assets by search query
      objectIds: ${JSON.stringify(objectIds)}
      `,
        error
      );

      return [];
    }
  }

  // Split the object ids list into lists of 75 and process those chunks
  const objectIdChunks = splitArray(objectIds, 75);
  const assetPromises = objectIdChunks.map((chunk) =>
    getAssetsByObjectIdsInner(chunk)
  );

  // Group all these assets but from a flat list
  const assetResults = await Promise.all(assetPromises);
  const assets = groupAssets(assetResults.flat());
  return assets;
}

async function getEnsembleImageUrl(ensembleIndex) {
  // In case we want to disable interaction with NetX for now
  if (NETX_ENABLED === false) {
    return null;
  }

  const fileNameQuery = generateGetAssetsByFileNameQuery(ensembleIndex);
  const searchQueryResponse = await makeNetXRequest(fileNameQuery);

  // Our query ended up with empty results - so no ensemble image url is possible
  const results =
    searchQueryResponse.data.result && searchQueryResponse.data.result.results;
  if (!results || !results.length) {
    return null;
  }

  const ensembleImageResult = results[0];
  const ensembleImageUrl = getImageURLFromRendition(
    ensembleImageResult,
    "Zoom"
  );

  return ensembleImageUrl;
}

module.exports = {
  getAssetByObjectNumber,
  getAssetsByObjectIds,
  getValueFromAsset: getValueFromNetXAttribute,
  getEnsembleImageUrl,
};

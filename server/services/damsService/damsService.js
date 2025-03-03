/** Service responsible for fetching from the NetX DAMS to retrieve asset information for
 * artwork and archival objects in the Barnes Collection
 */
const axios = require("axios");

const {
  generateGetAssetsByFolderQuery,
  generateGetFolderByPathQuery,
  generateGetAssetsByQuery: generateGetAssetsBySearchQuery,
  generateGetAssetsByFileNameQuery,
  generateGetArchiveAssetsQuery,
  COLLECTION_WEBSITE_API_FOLDER,
} = require("./queries");

const { transformInvno } = require("../../utils/transformInvno");
const { splitArray } = require("../../utils/splitArray");
const {
  sortAssets,
  groupAssets,
  getValueFromNetXAttribute,
  getImageURLFromRendition,
} = require("./utils");

const { transformNetXObjectNumber } = require("../../utils/transformInvno");

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

/** Retrieves the asset images related to a provided object number from NetX
 * This includes the Primary Display Image, other non-primary images, and
 * most importantly, any archive rendition images for the object
 *
 * @param objectNumber - The normal object number for the artwork
 */
async function getFullAssetByObjectNumber(objectNumber) {
  // In case we want to disable interaction with NetX for now
  if (NETX_ENABLED === false) {
    return [];
  }

  // Handle some edge-case where the object number is not valid
  if (!objectNumber) {
    return [];
  }

  // We need to transform the object number because it is formatted
  // differently in the folder paths in NetX
  const netxObjectNumber = transformInvno(objectNumber);

  // We'll check to see if we there exists a sub-folder
  // for this Object Number at the below folder path
  const folderQueryResponse = await makeNetXRequest(
    generateGetFolderByPathQuery(netxObjectNumber)
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

/** Given a list of object ids, this function retrieves the assets for each object id from NetX by doing the following
 * 1. Splits the total list of requested object ids into sub-arrays of 75 items in length
 * 2. Requests out to NetX to retrieve the asset information for each object id
 * 3. Returns a map of the object ids to the asset information for each object id
 *
 * @param objectIds - The list of object ids to retrieve asset information for from NetX
 * @returns {{}} - A map of the Object IDs to their asset list
 */
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

/** For a provided ensemble index number, this function makes a
 * request out to NetX to retrieve the image URL for the
 * image assigned to that particular ensemble index.
 *
 * It will return null if no image is defined for the ensemble index.
 * @param ensembleIndex - The number index assigned to a room/wall - i.e. to represent the ensemble
 */
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

/** Retrieves all archive assets from NetX. Archives are objects in NetX that have "Object Type (TMS)" set to "Archive Asset"
 * As of the present, there are about 82 archive assets in NetX, though they may each be associated with 1-or-more artwork assets.
 * This relation can be seen in the "folders" field of the archive assets response.
 *
 * This function will query NetX to retrieve all archive assets - not filtering for any particular Object Number/Object Id
 * It will return the archive assets in a map with the identified Object Number and the archives associated to that
 *
 * @returns {Promise<{}>} - A map of the Object IDs to their asset list
 */
async function getAllArchiveAssets() {
  // In case we want to disable interaction with NetX for now
  if (NETX_ENABLED === false) {
    return {};
  }

  try {
    const archiveAssetQueryResponse = await makeNetXRequest(
      generateGetArchiveAssetsQuery()
    );

    const archiveAssets = archiveAssetQueryResponse.data.result.results;
    const archiveAssetsMap = archiveAssets.reduce((collector, archiveAsset) => {
      // Get only assets that are in the Collection Website API folder. It's an array so
      // we do this just to be extra precise about only Collection Website API items
      const parentArtworkObjectFolders = archiveAsset.folders.filter(
        (folder) => folder.parentId === COLLECTION_WEBSITE_API_FOLDER
      );

      // Assuming we've found the information for this assets location in the Collection Website API folder
      // We'll iterate through each parent artwork object folder, get the object number from the folder path
      // and then store this archive asset to that object number, in the archive assets map
      parentArtworkObjectFolders.forEach((collectionWebsiteFolder) => {
        const [, damsObjectNumber] = collectionWebsiteFolder.path.split("/");
        const objectNumber = transformNetXObjectNumber(damsObjectNumber);

        // Initialize an empty array into the map for this object number
        if (collector[objectNumber] === undefined) {
          collector[objectNumber] = [];
        }

        collector[objectNumber].push(archiveAsset);
      });

      return collector;
    }, {});

    return archiveAssetsMap;
  } catch (error) {
    console.error(
      `[DAMSService][getAllArchiveAssets] Failed to retrieve archive assets`,
      error
    );

    return {};
  }
}

/** DAMS Service object to interact with the above functions */
const DAMSService = {
  getFullAssetByObjectNumber,
  getAssetsByObjectIds,
  getValueFromAsset: getValueFromNetXAttribute,
  getEnsembleImageUrl,
  getAllArchiveAssets,
};

module.exports = {
  DAMSService,
};

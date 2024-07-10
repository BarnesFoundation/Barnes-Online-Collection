/** Service responsible for fetching from the NetX DAMS to retrieve asset information for
 * artwork and archival objects in the Barnes Collection
 */
const axios = require("axios");
const {
  generateGetFolderByPathQuery,
} = require("./generateGetFolderByPathQuery");
const {
  generateGetAssetsByFolderQuery,
} = require("./generateGetAssetsByFolderQuery");
const {
  generateGetAssetsByQuery: generateGetAssetsBySearchQuery,
} = require("./generateAssetQuery");
const { transformInvno } = require("../../utils/transformInvno");
const { splitArray } = require("../../utils/splitArray");

const NETX_API_TOKEN = process.env.NETX_API_TOKEN;
const NETX_BASE_URL = process.env.REACT_APP_NETX_BASE_URL;
const NETX_ENABLED =
  (process.env.REACT_APP_NETX_ENABLED === "false" ? false : true) || false;

const PRIMARY_DISPLAY_IMAGE_TMS_FIELD = "Primary Display Image (TMS)";
const PRIMARY_DISPLAY_IMAGE_VALUE = "Primary Display Image";
const OBJECT_ID_TMS_FIELD = "ObjectID (TMS)";
const SYNC_TYPE_FIELD = "Sync Type";
const ARCHIVE_SYNC_TYPE_VALUE = "Archives Sync";

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

  // Split the object ids list into lists of 100 and process those chunks
  const objectIdChunks = splitArray(objectIds, 100);
  const assetPromises = objectIdChunks.map((chunk) =>
    getAssetsByObjectIdsInner(chunk)
  );

  // Group all these assets but from a flat list
  const assetResults = await Promise.all(assetPromises);
  const assets = groupAssets(assetResults.flat());
  return assets;
}

function sortAssets(assets) {
  if (assets.length === 0) {
    return assets;
  }
  const sortedAssets = [...assets];

  // We'll search through the results and put the Primary Display Image first
  // Look for the primary image. It is possible there is none specified
  const primaryImageIndex = assets.findIndex((asset) => {
    const primaryDisplayImageValue = getValueFromNetXAttribute(
      PRIMARY_DISPLAY_IMAGE_TMS_FIELD,
      asset
    );

    return primaryDisplayImageValue === PRIMARY_DISPLAY_IMAGE_VALUE;
  });

  // Shift the primary image to the front
  if (primaryImageIndex > -1) {
    const primaryResultItem = sortedAssets.splice(primaryImageIndex, 1)[0];
    sortedAssets.unshift(primaryResultItem);
  }

  // By now, we've sorted the primary image to the front, if one existed
  // Let's check if there's any Archive Correspondence and shift it to the end
  const { artworks, archives } = sortedAssets.reduce(
    (acc, asset) => {
      const syncTypeValue = getValueFromNetXAttribute(SYNC_TYPE_FIELD, asset);

      // It's an archive
      if (syncTypeValue === ARCHIVE_SYNC_TYPE_VALUE) {
        // TODO - Remove the below commentation once we fix archive image rendering
        // acc.archives.push(asset);
        return acc;
      }

      // Otherwise, it's an artwork
      acc.artworks.push(asset);
      return acc;
    },
    { artworks: [], archives: [] }
  );

  // Combine the two lists with the Archival Correspondences to the end
  return artworks.concat(archives);
}

function groupAssets(assets) {
  const groupedAssets = assets.reduce((collector, asset) => {
    const { attributes } = asset;
    if (!attributes) {
      return collector;
    }

    const objectId = getValueFromNetXAttribute(OBJECT_ID_TMS_FIELD, asset);
    if (!objectId) {
      return collector;
    }

    // Store this asset in a list under the Object ID of the asset
    if (!collector[objectId]) {
      collector[objectId] = [];
    }
    collector[objectId].push(asset);

    return collector;
  }, {});

  // Now that we have all the assets, let's sort the primary image to be first
  const sortedGroupedAssets = Object.entries(groupedAssets).reduce(
    (collector, [objectId, assets]) => {
      collector[objectId] = sortAssets(assets);
      return collector;
    },
    {}
  );

  return sortedGroupedAssets;
}

function getValueFromNetXAttribute(attributeName, asset) {
  const attributeValueList =
    asset.attributes && asset.attributes[attributeName]
      ? asset.attributes[attributeName]
      : [];
  const attributeValue =
    attributeValueList && attributeValueList.length
      ? attributeValueList[0]
      : "";

  return attributeValue;
}

module.exports = {
  getAssetByObjectNumber,
  getAssetsByObjectIds,
  getValueFromAsset: getValueFromNetXAttribute,
};

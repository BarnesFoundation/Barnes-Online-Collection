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

const NETX_API_TOKEN = process.env.NETX_API_TOKEN;
const NETX_BASE_URL = process.env.REACT_APP_NETX_BASE_URL;
const NETX_ENABLED =
  (process.env.REACT_APP_NETX_ENABLED === "false" ? false : true) || false;

const PRIMARY_DISPLAY_IMAGE_TMS_FIELD = "Primary Display Image (TMS)";
const PRIMARY_DISPLAY_IMAGE_VALUE = "Primary Display Image";
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

async function getAssetByObjectNumber(objectNumber) {
  // In case we want to disable interaction with NetX for now
  if (NETX_ENABLED === false) {
    return [];
  }

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
        acc.archives.push(asset);
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
};

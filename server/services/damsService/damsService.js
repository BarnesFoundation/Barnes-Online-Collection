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
  process.env.REACT_APP_NETX_ENABLED === "false" ? false : true || false;

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

  const assets = assetQueryResponse.data.result.results;
  return assets;
}

module.exports = {
  getAssetByObjectNumber,
};

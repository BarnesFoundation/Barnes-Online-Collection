function generateGetAssetsByFolderQuery(folderId) {
  return {
    id: "13576991614322",
    method: "getAssetsByFolder",
    params: [
      folderId,
      false,
      {
        data: [
          "asset.id",
          "asset.base",
          "asset.attributes",
          "asset.file",
          "asset.proxies",
        ],
      },
    ],
    jsonrpc: "2.0",
  };
}

module.exports = {
  generateGetAssetsByFolderQuery,
};

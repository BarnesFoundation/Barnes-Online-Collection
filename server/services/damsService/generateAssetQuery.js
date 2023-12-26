function generateGetAssetQuery(objectId) {
  return {
    jsonrpc: "2.0",
    id: `GET_ASSETS_BY_QUERY_${objectId}`,
    method: "getAssetsByQuery",
    params: [
      {
        query: [
          // Query statement is to scope the search within our "Collection Website API" folder in NetX
          {
            operator: "and",
            folder: {
              folderId: 646,
              recursive: false,
            },
          },
          {
            operator: "and",
            exact: {
              attribute: "ObjectID (TMS)",
              value: objectId,
            },
          },
        ],
      },
      {
        sort: {
          field: "name",
          order: "asc",
        },
        page: {
          startIndex: 0,
          size: 10,
        },
        data: [
          "asset.id",
          "asset.base",
          "asset.attributes",
          "asset.file",
          "asset.proxies",
        ],
      },
    ],
  };
}

module.exports = {
  generateGetAssetQuery,
};

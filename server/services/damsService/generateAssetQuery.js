const COLLECTION_WEBSITE_API_FOLDER = 646;
function generateGetAssetsByQuery(objectIdList) {
  const orObjectIdQueries = objectIdList.map((objectId) => {
    return {
      operator: "or",
      exact: {
        attribute: "ObjectID (TMS)",
        value: objectId,
      },
    };
  });

  return {
    jsonrpc: "2.0",
    id: `GET_ASSETS_BY_QUERY_OBJECT_IDS${Date.now()}`,
    method: "getAssetsByQuery",
    params: [
      {
        query: [
          // Query statement is to scope the search within our "Collection Website API" folder in NetX
          {
            operator: "and",
            folder: {
              folderId: COLLECTION_WEBSITE_API_FOLDER,
              recursive: true,
            },
          },
          ...orObjectIdQueries,
        ],
      },
      {
        sort: {
          field: "name",
          order: "asc",
        },
        page: {
          startIndex: 0,
          size: 200,
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
  generateGetAssetsByQuery,
};

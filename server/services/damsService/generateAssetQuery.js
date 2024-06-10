const COLLECTION_WEBSITE_API_FOLDER = 646;
function generateGetAssetsByQuery(objectIdList) {
  const objectIdQueries = objectIdList.map((objectId) => {
    return {
      // If we're only requested one specific Object ID, we're
      // fine to use the "and" operator for an exact match
      // Otherwise, we want multiple Object IDs in our request
      // so we have to use the "or" operator to allow that
      operator: objectIdList.length === 1 ? "and" : "or",
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
          // We only want primary images
          {
            operator: "and",
            exact: {
              attribute: "Primary Display Image (TMS)",
              value: "Primary Display Image",
            },
          },
          // We only want jpgs
          {
            operator: "and",
            exact: {
              field: "fileType",
              value: "jpg",
            },
          },
          // Subquery to only get the Object IDs we want
          {
            operator: "and",
            subquery: {
              query: objectIdQueries,
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
          size: 3000,
        },
        data: [
          "asset.id",
          "asset.base",
          "asset.attributes",
          "asset.file",
          "asset.proxies",
          "asset.folders",
        ],
      },
    ],
  };
}

module.exports = {
  generateGetAssetsByQuery,
};

const COLLECTION_WEBSITE_API_FOLDER = "Collection Website API";

function generateGetFolderByPathQuery(objectNumberWithUnderscores) {
  return {
    id: "13576991614322",
    method: "getFolderByPath",
    params: [
      `${COLLECTION_WEBSITE_API_FOLDER}/${objectNumberWithUnderscores}`,
      {
        data: ["folder.id", "folder.base", "folder.children"],
      },
    ],
    jsonrpc: "2.0",
  };
}

module.exports = {
  generateGetFolderByPathQuery,
};

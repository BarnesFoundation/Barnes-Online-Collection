const axios = require("axios");

const NETX_BASE_URL = process.env.NETX_BASE_URL;
const NETX_API_TOKEN = process.env.NETX_API_TOKEN;

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
                data: ["asset.id", "asset.base", "asset.attributes", "asset.file", "asset.proxies"],
            },
        ],
    };
}

async function getAssetByObjectId(objectId) {
    const response = await axios({
        baseURL: NETX_BASE_URL,
        url: '/api/rpc',
        method: 'POST',
        headers: {
            Authorization: `apiToken ${NETX_API_TOKEN}`
        },
        data: generateGetAssetQuery(objectId)
    });

    return response.data.result.results;
}

module.exports = {
    getAssetByObjectId,
};

const esClient = require('../utils/esClient');
const { fixDiacritics } = require("../utils/fixDiacritics");

let esIndex = process.env.ELASTICSEARCH_INDEX

const performSearch = async (body) => {
    return esClient.search(
        {
            index: esIndex,
            body: body,
            // _source: 
        },
    );
}

const search = async (req, res) => {
    // Get the body from a get or post request
    const body = (req.method === 'GET') ? req.query.body : req.body.body;
    try {
        const esRes = await performSearch(body)
        res.json(esRes)
    } catch (e) {
        res.json(e)
    }
}

const getObjectById = async (req, res) => {
    const options = {
        index: esIndex,
        type: 'object',
        id: req.params.object_id
    };

    esClient.get(options, function (error, esRes) {
        if (error) {
            console.error(`[error] esClient: ${error.message}`)
            res.json(error)
        } else {
            res.json(esRes._source)
        }
    });
}

module.exports = {
    search,
    getObjectById,
}
const esClient = require('../utils/esClient');
const { fixDiacritics } = require("../utils/fixDiacritics");

let esIndex = process.env.ELASTICSEARCH_INDEX

const performSearch = (body, res) => {
    esClient.search(
        {
            index: esIndex,
            body: body,
            // _source: 
        },
        (error, esRes) => {
            if (error) {
                res.json(error)
            } else {
                if (esRes.hits && esRes.hits.hits) {

                    // Replace all hit's source with santitized source object.
                    // To extend this, replace key w/ ternary of _source[key] && fixDiacritics()
                    esRes.hits.hits = esRes.hits.hits.map(({ _source, ...rest }) => ({
                        _source: {
                            ..._source,
                            title: _source.title ? fixDiacritics(_source.title) : undefined,
                        },
                        ...rest,
                    }));
                }

                res.json(esRes)
            }
        });
}

const search = (req, res) => {
    // Get the body from a get or post request
    const body = (req.method === 'GET') ? req.query.body : req.body.body;
    performSearch(body, res)
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
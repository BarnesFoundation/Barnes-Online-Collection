const axios = require('axios');
const memoryCache = require('memory-cache')
const esClient = require('../utils/esClient');

let craftRequestConfig = {
	baseURL: process.env.REACT_APP_WWW_URL,
	method: 'get'
};

const { oneDay } = require('../constants/times');

// Add authentication if running in staging/development
if (process.env.NODE_ENV.toLowerCase() !== 'production') {
	craftRequestConfig = {
		...craftRequestConfig,
		auth: {
			username: process.env.WWW_USERNAME,
			password: process.env.WWW_PASSWORD
		}
	};
}

/** Returns the entries from the main Craft site */
const getEntries = () => {
	return new Promise(async (resolve) => {

		// Request for fetching entry
		const entryRequest = (slug) => {
			return axios(`/api/entry?slug=${slug}`, craftRequestConfig);
		};

		// Fetch all in parallel
		const entriesRequests = [
			entryRequest('the-barnes-collection'),
			entryRequest('library-archives'),
			entryRequest('the-barnes-arboretum')
		];
		const responses = await Promise.all(entriesRequests);
		const entries = responses.map((response) => response.data);

		resolve(entries);
	});
};

/** Fetches the results for a query against the Craft site */
const getSuggestions = async (request, response) => {
	const { q } = request.query;
	const aConfig = {
		...craftRequestConfig,
		url: `/api/suggest?q=${q}`
	};

	const suggestionResponse = await axios(aConfig);

	response.json(suggestionResponse.data);
};

/** Fetches the auto-suggest results for a query against the Craft site */
const getAutoSuggestions = async (request, response) => {
	const { q: query } = request.query;

	const { aggregations: { people: { buckets } } } = await esClient.search({
		body: {
			"size": 0,
			"query": {
				"bool": {
					"filter": {
						"exists": {
							"field": "imageSecret"
						}
					},
					"must": {
						"multi_match": {
							"query": query,
							"type": "bool_prefix",
							"fields": ["people", "people.text", "people.suggest"]
						}
					}
				}
			},
			"_source": ["id", "title", "people"],
			"aggregations": {
				"people": {
					"terms": {
						"field": "people.text",
						"size": 200
					}
				}
			}
		}
	});

	// Wrap return results in <strong> tags.
	const highlighted = buckets.map(({ key, doc_count }) => {
		const queryIndex = key.toLowerCase().indexOf(query.toLowerCase()); // In case query is LikE thIS.

		const start = key.slice(0, queryIndex);
		const middle = key.slice(queryIndex, queryIndex + query.length);
		const end = key.slice(queryIndex + query.length);

		return ({
			key: `${start}<strong>${middle}</strong>${end}`,
			doc_count: doc_count,
			raw: key, // For when filter is applied.
		});
	});

	response.json({ collectionAdvancedSearch: highlighted });
};

/** Stores the entries from Craft in a cache */
const entryCacher = async (request, response) => {
	const key = `__cache__api_craft__entries`;
	const body = memoryCache.get(key);

	if (body) {
		response.append('x-cached', true);
		response.send(body);
	}
	else {
		const entries = await getEntries();
		response.json(entries);
		memoryCache.put(key, entries, oneDay);
	}
}

module.exports = {
	getEntries,
	getSuggestions,
	getAutoSuggestions,
	entryCacher
};
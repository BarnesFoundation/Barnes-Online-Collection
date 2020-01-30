const esClient = require('../server/utils/esClient');
const index = process.env.ELASTICSEARCH_INDEX;
const bodybuilder = require('bodybuilder');

const getArtists = async () => {

	console.log('getting artists');
	const body = bodybuilder()
		.size(0)
		.aggregation('terms', 'unique_artists', {
			"field": "people.text",
			"size": "110"

		})
		.rawOption('_source', 'people')
		.build();


	esClient.search({
		index,
		body
	}, (error, response) => {
		if (error) console.log(error);
		console.log(response);
		return response;
	});
}

module.exports = {
	getArtists
}

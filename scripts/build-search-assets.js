const fs = require('fs');
const path = require('path');
const bodybuilder = require('bodybuilder');
const esClient = require('../server/utils/esClient');

const ensemblesList = require('../src/ensembleIndexes');
const index = process.env.ELASTICSEARCH_INDEX;
const constantsDirectory = path.resolve(__dirname, '../src/');

// Static copyrights list
const copyrights = {
	'In Copyright': [1, 3],
	'Copyright Undetermined': [2, 6],
	'Public Domain': [4, 7, 8, 10],
};

// Static years list
const years = [
	'-4000',
	'1',
	'1000',
	'1500',
	'1600',
	'1700',
	'1800',
	'1810',
	'1820',
	'1830',
	'1840',
	'1850',
	'1860',
	'1870',
	'1880',
	'1890',
	'1900',
	'1905',
	'1910',
	'1915',
	'1920',
	'1930',
	'1940',
	'1950',
	'1960'
];

/** Returns the unique bucket values that is eventually used to populate the front-end collection filters and dropdowns
 * @param {string} aggregationName - The name to provide for this aggregation
 * @param {string} aggregationField - The name of the field to conduct an aggregation for
 */
const getUniqueSearchValues = async (aggregationName, aggregationField) => {

	// Build query for unique artists
	const body = bodybuilder()
		.size(0)
		.aggregation('terms', aggregationName, {
			"field": aggregationField,
			"size": "200"
		})
		.build();

	return await new Promise((resolve) => {
		esClient.search({
			index, body
		}, (error, response) => {
			if (error) {
				console.log(error);
				resolve(error);
			}

			// Grab the unique buckets
			let results = response.aggregations[`agg_terms_${aggregationName}`].buckets;

			resolve(results);
		});
	});
}

/** Writes the search assets file to the specified directory
 * @param {string} fileName - The name for the file
 * @param {string} fileContents - The contents to be written to the file
 */
const writeAssetsFile = async (fileName, fileContents) => {
	return await new Promise((resolve) => {
		fs.writeFile(path.join(constantsDirectory, fileName), fileContents, (error) => {
			if (error) {
				console.log(error);
				resolve('Could not write searchAssets.json');
			}
			else { resolve('Successfully wrote searchAssets.json'); }
		});
	});
}

/** Generates the payload for the list of locations for artworks using the ensemble indices */
const generateLocations = () => {
	return Object.entries(ensemblesList).reduce((acc, pair) => {

		const [ensembleIndex, ensemble] = pair;
		let { roomTitle } = ensemble;

		// Consolidate Second Floor Balcony virtual rooms to single room
		if (roomTitle.includes('Second Floor Balcony')) {
			roomTitle = 'Second Floor Balcony (Room 24)';
		}

		// If our accumulator doesn't yet have the room, add it
		if (acc.hasOwnProperty(roomTitle) == false) {
			Object.assign(acc, { [roomTitle]: [] });
		}

		// Push the room number
		acc[roomTitle].push(parseInt(ensembleIndex));

		return acc;
	}, {});
}

/** Executes the work to generate the search assets */
const generateAssets = async () => {

	const searchAssetsObject = {
		artists: await getUniqueSearchValues('uniq_peoples', 'people.text'),
		cultures: await getUniqueSearchValues('uniq_cultures', 'culture.keyword'),
		mediums: await getUniqueSearchValues('uniq_mediums', 'medium.keyword'),
		locations: generateLocations(),
		copyrights,
		years
	};

	const searchAssetsDocument = JSON.stringify(searchAssetsObject, null, '\t');
	const result = await writeAssetsFile('searchAssets.json', searchAssetsDocument);

	return result;
}

module.exports = {
	generateAssets
}

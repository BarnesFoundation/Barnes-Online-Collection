const fs = require('fs');
const path = require('path');
const bodybuilder = require('bodybuilder');
const esClient = require('../server/utils/esClient');

const ensemblesList = require('../src/ensembleIndexes');
const index = process.env.ELASTICSEARCH_INDEX;
const constantsDirectory = path.resolve(__dirname, '../src/');

// Static copyrights list
const copyrights = {
	0: 'N/A',
	1: 'Copyright',
	2: 'World Rights - Copyright Undetermined',
	3: 'ARS',
	4: 'Public Domain - Public Domain',
	5: 'VAGA',
	6: 'No known claimant',
	8: 'No known rights - Public Domain',
	10: 'World Rights - Public Domain'
}

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

		const [roomNumber, ensemble] = pair;
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
		acc[roomTitle].push(roomNumber);

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
		copyrights
	};

	const searchAssetsDocument = JSON.stringify(searchAssetsObject, null, '\t');
	const result = await writeAssetsFile('searchAssets.json', searchAssetsDocument);

	return result;
}

module.exports = {
	generateAssets
}

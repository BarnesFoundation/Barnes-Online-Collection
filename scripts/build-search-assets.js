const fs = require('fs');
const path = require('path');
const bodybuilder = require('bodybuilder');
const esClient = require('../server/utils/esClient');

const index = process.env.ELASTICSEARCH_INDEX;
const publicDirectory = path.resolve(__dirname, '../public/');

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
		fs.writeFile(path.join(publicDirectory, fileName), fileContents, (error) => {
			if (error) {
				console.log(error);
				resolve('Could not write searchAssets.json');
			}
			else { resolve('Successfully wrote searchAssets.json'); }
		});
	});
}

/** Executes the work to generate the search assets */
const generateAssets = async () => {

	const searchAssetsObject = {};

	searchAssetsObject['artists'] = await getUniqueSearchValues('uniq_people', 'people.text');
	searchAssetsObject['cultures'] = await getUniqueSearchValues('uniq_culture', 'culture.keyword');
	searchAssetsObject['locations'] = await getUniqueSearchValues('uniq_locations', 'locations');
	searchAssetsObject['copyrights'] = await getUniqueSearchValues('uniq_copyright', 'copyright.keyword');

	const searchAssetsDocument = JSON.stringify(searchAssetsObject, null, '\t');
	const result = await writeAssetsFile('searchAssets.json', searchAssetsDocument);

	return result;
}

module.exports = {
	generateAssets
}

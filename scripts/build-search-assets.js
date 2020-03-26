const fs = require('fs');
const path = require('path');
const bodybuilder = require('bodybuilder');
const esClient = require('../server/utils/esClient');

const ensemblesList = require('../src/ensembleIndexes');
const index = process.env.ELASTICSEARCH_INDEX;
const constantsDirectory = path.resolve(__dirname, '../public/resources');

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

// Static cultures list
const cultures = [
	'Acoma Pueblo',
	'Akan',
	'Akye',
	'American',
	'Anyi',
	'Austrian',
	'Baluch',
	'Bamana',
	'Bamileke',
	'Baule',
	'Beembe',
	'Chinese',
	'Continental',
	'Cretan',
	'Cypriot',
	'Dan',
	'Dogon peoples',
	'Dutch',
	'Edo',
	'Egyptian',
	'English',
	'Etruscan',
	'European',
	'Fang',
	'Flemish',
	'French',
	'German',
	'Greek',
	'Guro',
	'Indian',
	'Iranian',
	'Italian',
	'Japanese',
	'Jula',
	'Kanyok',
	'Kissa',
	'Kongo',
	'Korean',
	'Kota',
	'Kuba',
	'Kulango',
	'Kyaman',
	'Lagoon',
	'Lega',
	'Luba',
	'Luluwa',
	'Mande',
	'Marka',
	'Merina',
	'Mesopotamian',
	'Mexican',
	'Middle Eastern',
	'Mossi',
	'Navajo',
	'Ndengese',
	'Netherlandish',
	'New Mexican',
	'Nsapo',
	'Oceanian',
	'Pende',
	'Persian',
	'Punu',
	'Roman',
	'San Ildefonso Pueblo',
	'Santa Ana Pueblo',
	'Santo Domingo Pueblo',
	'Sapi',
	'Scottish',
	'Senufo',
	'Sherbro',
	'Songye',
	'Spanish',
	'Sri Lankan',
	'Suku',
	'Syrian',
	'Swedish',
	'Teke',
	'Tesuque Pueblo',
	'Thai',
	'Tsogho',
	'Turkish',
	'Vili',
	'Yaka',
	'Zia Pueblo',
	'Zuni Pueblo',
];

/** Returns the unique bucket values that is eventually used to populate the front-end collection filters and dropdowns
 * @param {string} aggregationName - The name to provide for this aggregation
 * @param {string} aggregationField - The name of the field to conduct an aggregation for
 * @param {any} subAggregation - The a sub-aggregation to be applied to the results of the top-level aggregation (optional)
 */
const getUniqueSearchValues = async (aggregationName, aggregationField, subAggregation) => {

	// Add the sub-aggregation query if subAggregation defined
	const nest = (subAggregation) ? (a) => a.aggregation('top_hits', { size: 1, _source: [subAggregation] }, subAggregation) : null;

	// Build query for unique artists
	const body = bodybuilder()
		.size(0)
		.aggregation('terms', aggregationName, {
			"field": aggregationField,
			"size": "200"
		}, nest)
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
			let { buckets } = response.aggregations[`agg_terms_${aggregationName}`];

			// Reduce the buckets if subAggregation was defined, will need to be expanded upon if we end up using more subAggregations
			if (subAggregation) {
				buckets = buckets.reduce((acc, cv) => {
					const { key, doc_count } = cv;

					// Name the field the same as the sub aggregation field
					const field = cv[subAggregation]['hits']['hits'][0]._source[subAggregation];

					// Add to the object list
					acc.push({ key, doc_count, [subAggregation]: field });
					return acc;
				}, []);
			}
			
			resolve(buckets);
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
		artists: await getUniqueSearchValues('uniq_peoples', 'people.text', 'sortedName'),
		cultures: cultures /* await getUniqueSearchValues('uniq_cultures', 'culture.keyword') */,
		mediums: await getUniqueSearchValues('uniq_mediums', 'medium.keyword'),
		classifications: await getUniqueSearchValues('uniq_classifications', 'classification'),
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

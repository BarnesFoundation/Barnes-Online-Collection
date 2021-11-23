const axios = require('axios');
const fs = require('fs');
const path = require('path')

const apiUrl = "https://collection.barnesfoundation.org/api/get-search-assets";
const constantsDirectory = path.resolve(__dirname, '../public/resources');

const logError = (errorMsg) => {
	console.log('Oops, Something went wrong while trying to build the search assets.')
	console.log(errorMsg)
}

const fetchSearchAssets = () => {
	return axios.get(apiUrl).catch((error) => {
		logError(error)
	})
}

const writeSearchAssetsFile = (text, onSuccess) => {
	const pathName = path.join(constantsDirectory, "searchAssets.json");
	fs.writeFile(pathName, text, (error) => {
		if (error) {
			return logError(error);
		}

		onSuccess();
	})
}

fetchSearchAssets().then(response => {
	writeSearchAssetsFile(response.data, () => {
		console.log("Search assets generated in public/resources/searchAssets.json 👍")
	})
})
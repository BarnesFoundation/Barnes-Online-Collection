
export const sharePlatforms = {
	FACEBOOK: 'FACEBOOK',
	TWITTER: 'TWITTER',
	PINTEREST: 'PINTEREST',
	EMAIL: 'EMAIL'
};

/** Generates the shareable link for an object
 * @param {string} artist - name of the artist
 * @param {string} id - the id of the object to share
 * @param {string} artworkTitle - title of the artwork to share
 * @param {string} platform - the platform the link should be generated for
 */
export const createShareForPlatform = (artist, artworkTitle, id, platform) => {

	const shareableText = generateShareableText(artist, artworkTitle, id);
	return generateSharePlatformLink(platform, shareableText);
}

/** Generates the Collection url for the passed object id
 * @param {string} id - the id of the object 
 */
export const createObjectUrl = (id) => {
	return `https://collection.barnesfoundation.org/objects/${id}`;
}


const generateShareableText = (artist, artworkTitle, id) => {

	// Setup share items
	const url = createObjectUrl(id);
	const companyName = `Barnes Foundation`;
	const hashtags = ['BarnesFocus', 'SeeingTheBarnes'];

	let title = artworkTitle;

	// If the artist is a known artist -- meaning not "unidentified", add it to the title and hashtags
	if (artist && !artist.toLowerCase().includes('unidentified')) {
		title += ` by ${artist}`;
		hashtags.push(`${artist.split(' ').join('').split('-').join('')}`);
	}

	return { url, title, companyName, hashtags };
}

/** Generates the sharing link for the specified platform
 * @param {string} platform - platform to share on
 * @param {object} shareObject - share object containing items needed for sharing
 */
const generateSharePlatformLink = (platform, { url, title, companyName, hashtags }) => {

	switch (platform) {
		case sharePlatforms.FACEBOOK: {
			return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		}

		case sharePlatforms.TWITTER: {
			const text = title.split(' ').join('+');
			const via = `the_barnes`;
			return `https://twitter.com/intent/tweet?&text=${text}&via=${via}&url=${url}&hashtags=${hashtags.join()}`
		}

		case sharePlatforms.EMAIL: {
			const body = `
			${title} &mdash; ${url}
			from The ${companyName}
			`;

			return `mailto:?body=${body}&subject=${title}`;
		}

		case sharePlatforms.PINTEREST: {
			return `http://pinterest.com/pin/create/button/?url${encodeURI(url)}&description=${title}`
		}
	}
}
//&media={URI-encoded URL of the image to pin}
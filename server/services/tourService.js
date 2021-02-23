const tours = require('../constants/tours.json');

/** Retrieves the tour with the provided slug */
const getTour = async (request, response) => {
	const tourId = request.params.id;

	// Return the found tour
	if (tours.hasOwnProperty(tourId)) {
		return response
			.status(200)
			.json(tours[tourId]);
	}

	// Otherwise, this isn't a tour we have
	return response
		.status(404)
		.json({});
};

module.exports = {
	getTour
};
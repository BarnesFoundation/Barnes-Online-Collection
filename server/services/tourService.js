const tours = require("../constants/tours");
const eyeSpyTours = require("../constants/tours/eyeSpy")
const elasticSearchService = require("./elasticSearchService");

const getTourObjects = async (tourId, tours) => {
  // Return the tour data except for the test tour
  if (tours.hasOwnProperty(tourId) && tourId !== "test-tour" && tourId !== "test") {
    const esRes = await elasticSearchService.performSearch(tours[tourId]["body"])
    const objects = esRes.hits.hits
    const tour = { ...tours[tourId], objects }
    return tour
    // Return test tour if it is not production environment
  } else if (
    process.env.NODE_ENV.toLowerCase() !== "production"
    && (tourId === "test-tour" || tourId === "test")
  ) {
    return tours[tourId]
    // Otherwise, this tour does not exist
  } else {
    return false
  }
}

/** Retrieves the tour with the provided slug */
const getTour = async (request, response) => {
  const tourId = request.params.id;
  try {
    // Get data for tour objects
    const tour = await getTourObjects(tourId, tours)

    // If tour object is truthy, a tour exists
    if (tour) {
      return response.status(200).json(tour)
      // Otherwise, the tour does not exist
    } else {
      return response
        .status(404)
        .json({ message: `No tour with id ${tourId} found` });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e)
  }
};

const getEyeSpyTour = async (request, response) => {
  const tourId = request.params.id;
  try {
    // Get data for tour objects
    const tour = await getTourObjects(tourId, eyeSpyTours)

    // If tour object is truthy, a tour exists
    if (tour) {
      // Combine the clue data with the obj data
      return response.status(200).json(tour)
      // Otherwise, the tour does not exist
    } else {
      return response
        .status(404)
        .json({ message: `No Eye Spy tour with id ${tourId} found` });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e)
  }
}

module.exports = {
  getTour,
  getEyeSpyTour,
};

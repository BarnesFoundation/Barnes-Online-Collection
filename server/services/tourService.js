const tours = require("../constants/tours");
const elasticSearchService = require("./elasticSearchService");
const graphQLClient = require("../utils/graphCmsClient");

const formatSearchBody = (tour) => {
  const body = {
    "from": 0,
    "size": 25,
    "_source": [
      "id",
      "title",
      "people",
      "medium",
      "imageOriginalSecret",
      "imageSecret",
      "ensembleIndex",
      "objRightsTypeId",
      "onview",
      "invno",
      "image",
      "curatorialApproval",
      "shortDescription",
      "nationality",
      "birthDate",
      "deathDate",
      "artistPrefix",
      "artistSuffix",
      "culture",
      "displayDate",
      "medium",
      "dimensions",
      "creditLine",
      "longDescription",
      "bibliography",
      "exhHistory",
      "publishedProvenance"
    ],
    "query": { "bool": { "filter": { "terms": { "invno": [] } } } }
  }
  const invNums = tour.collectionObjects.map(object => object.inventoryNumber.toLowerCase())
  body.query.bool.filter.terms.invno = invNums;
  return body
}

const getTourObjects = async (tourId, tourData) => {
  // Return the tour data except for the test tour
  if (tourId !== "test-tour" && tourId !== "test") {
    const body = formatSearchBody(tourData)
    const esRes = await elasticSearchService.performSearch(body)
    const objects = esRes.hits.hits
    const tour = { tourData, objects }
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
  // Get the full tour path and remove /api from the slug
  const slug = request.url.slice(5);
  const tourId = slug.split("/")[1]

  try {
    // Get tour content from GraphCMS
    const { tour } = await graphQLClient.request(
      `
      query GetTour($slug: String) {
        tour(where: {slug: $slug}) {
          description {
            html
          }
          roomOrder {
            id
            room
          }
          slug
          subtitle
          title
          collectionObjects {
            heroImage
            id
            inventoryNumber
            overlay {
              html
            }
            description {
              html
            }
          }
          localizations(includeCurrent: false) {
            slug
            subtitle
            title
            description {
              html
            }
            locale
            collectionObjects {
              id
              inventoryNumber
              heroImage
              localizations(includeCurrent: false) {
                locale
                description {
                  html
                }
                overlay {
                  html
                }
              }
            }
          }
        }
      }
      `,
      { "slug": slug }
    )

    // Get data for tour objects
    const tourData = await getTourObjects(tourId, tour);

    // // If tour object is truthy, a tour exists
    if (tourData) {
      return response.status(200).json(tourData)
      // Otherwise, the tour does not exist
    } else {
      return response
        .status(404)
        .json({ message: `No tour with slug ${slug} found` });
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e)
  }
};

module.exports = {
  getTour,
};

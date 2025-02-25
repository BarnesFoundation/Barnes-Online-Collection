/** Service responsible for abstracting out the utilities for retrieving asset information for the Barnes Collection
 *  and caching the responses to avoid refetching object information that is needed frequently
 *
 */
const damsService = require("./damsService");
const memoryCache = require("memory-cache");
const { oneWeek } = require("../constants/times");

const OBJECT_CACHE = "OBJECT_CACHE";
const ENSEMBLE_CACHE = "ENSEMBLE_CACHE";

/** Creates the cache key for the given object number
 * @param {string} objectNumber - The object number of the artwork
 * @returns {string} The cache key for the artwork
 */
function makeObjectCacheKey(objectNumber) {
  return `${OBJECT_CACHE}_${objectNumber}`;
}

/** Creates the cache key for the given ensemble index
 * @param {number} ensembleIndex - The ensemble index
 * @returns {string} The cache key for the ensemble index
 */
function makeEnsembleCacheKey(ensembleIndex) {
  return `${ENSEMBLE_CACHE}_${ensembleIndex}`;
}

function setArtworkInCache(objectCacheKey, objectAsset) {
  memoryCache.put(objectCacheKey, objectAsset, oneWeek);
}

/** Higher-level function for retrieving the NetX assets for an artwork given its object number
 * but with caching functionality implemented.
 *
 * If the assets are available in the cache, then they're pulled from there. Otherwise, a fresh
 * request is made to NetX to retrieve the assets, after which they're placed into the cache
 *
 * @param {string} objectNumber - The object number of the artwork to retrieve assets for
 * @returns The assets for the artwork, pulled from either the cache or NetX directly
 */
async function getAssetByObjectNumber(objectNumber) {
  const objectCacheKey = makeObjectCacheKey(objectNumber);
  const objectAsset = memoryCache.get(objectCacheKey);

  // If we don't have a cached version of this object asset
  // let's fetch it live, store it, then return it
  if (!objectAsset) {
    const liveObjectAsset = await damsService.getAssetByObjectNumber(
      objectNumber
    );
    setArtworkInCache(objectCacheKey, liveObjectAsset);

    return liveObjectAsset;
  }

  // Otherwise, we have the cached version
  return objectAsset;
}

/** Higher-level function for retrieving the NetX assets for multiple artworks given a list of artwork objects
 * but with caching functionality implemented.
 *
 * If the assets are available in the cache, then they're pulled from there. Otherwise, a fresh
 * request is made to NetX to retrieve the assets, after which they're placed into the cache
 *
 * @param {Array<{objectId: string, objectNumber: string}>} artworksInformation - The object number of the artwork to retrieve assets for
 * @returns The assets for the artwork, pulled from either the cache or NetX directly
 */
async function getAssetByObjectIds(artworksInformation) {
  const artworkAssetsMap = {};
  const artworksToRequest = [];

  // Collect the requested artwork information from the cache, or identify as needing to be requested
  artworksInformation.forEach((artwork) => {
    const objectCacheKey = makeObjectCacheKey(artwork.objectNumber);
    const cachedObject = memoryCache.get(objectCacheKey);

    // We have the cached version of the object, so let's persist it
    if (cachedObject) {
      artworkAssetsMap[artwork.objectId] = cachedObject;
    }
    // Otherwise, we need to request it from the DAMS
    else {
      console.debug(
        `[getAssetByObjectIds] Object Number ${artwork.objectNumber} do not yet exist in cache`
      );
      artworksToRequest.push(artwork);
    }
  });

  const retrievedArtworkAssetsMap = await damsService.getAssetsByObjectIds(
    artworksToRequest.map(({ objectId }) => objectId)
  );

  // We've retrieved the necessary artworks from the DAMS. Let's iterate through them
  // to add them to the artwork assets map, but more importantly, cache them for the next request
  artworksToRequest.forEach((artwork) => {
    const objectCacheKey = makeObjectCacheKey(artwork.objectNumber);
    const artworkAsset = retrievedArtworkAssetsMap[artwork.objectId];

    if (artworkAsset) {
      artworkAssetsMap[artwork.objectId] = artworkAsset;
      setArtworkInCache(objectCacheKey, artworkAsset);
    } else {
      console.warn(
        `[getAssetByObjectIds] Unable to fetch artwork assets from the DAMS for Object Number ${artwork.objectNumber}`
      );

      // We'll set an empty array to keep type-safetiness, but also to help ensure
      // we don't continue to request out for artwork assets that do not exist
      artworkAssetsMap[artwork.objectId] = [];
      setArtworkInCache(objectCacheKey, []);
    }
  });

  return artworkAssetsMap;
}

async function getAssetsForArtworks(artworks) {
  if (artworks.length === 0) {
    return artworks;
  }

  // The provided artworks are typically the full ElasticSearch response records
  // We normalize them here to just contain the objectId and objectNumber
  const artworksInformation = artworks.reduce((collector, artwork) => {
    if (artwork._source.id) {
      collector.push({
        objectId: artwork._source.id,
        objectNumber: artwork._source.invno ? artwork._source.invno : null,
      });
    }
    return collector;
  }, []);

  // If we're fetching multiple artworks - then we typically do not need
  // archival renditions to be included in our response. So we're fine
  // with just this general assets call to get the display image
  if (artworks.length > 1) {
    const artworkAssetsMap = await getAssetByObjectIds(artworksInformation);

    // We iterate through each artwork from the original list and provide its renditions
    // by looking them up in the artwork assets map using the Object ID
    const artworksWithAssets = artworks.map((artwork) => {
      // Get the assets for this artwork and store them in our cache for later reuse
      const artworkAssets = artworkAssetsMap[artwork._source.id];
      artwork._source["renditions"] = artworkAssets;
      return artwork;
    });

    return artworksWithAssets;
  }

  // Otherwise, we're fetching a single artwork object's renditions
  // so we do need archival renditions as part of our list
  // and need some extra work to do so
  const artwork = { ...artworks[0] };
  const artworkWithDAMSInformation = await addAssetFields(artwork);

  return [artworkWithDAMSInformation];
}

/** Higher-level function for retrieving the ensemble image URL for a given ensemble index
 * but with caching functionality implemented.
 *
 * If the ensemble image information is available in the cache, then they're pulled from there.
 * Otherwise, a fresh request is made to NetX to retrieve the information, after which it is cached
 *
 * @param {number} ensembleIndex - The ensemble index to retrieve the image information for
 * @returns {string} The information for the image associated with the ensemble index
 */
async function getEnsembleImageUrl(ensembleIndex) {
  const ensembleCacheKey = makeEnsembleCacheKey(ensembleIndex);
  const ensembleImageUrl = memoryCache.get(ensembleCacheKey);

  // If we don't have a cached version of this ensemble image url
  // let's fetch it live, store it, then return it
  if (!ensembleImageUrl) {
    const liveEnsembleImageUrl = await damsService.getEnsembleImageUrl(
      ensembleIndex
    );
    memoryCache.put(ensembleCacheKey, liveEnsembleImageUrl, oneWeek);

    return liveEnsembleImageUrl;
  }

  // Otherwise, we have the cached version
  return ensembleImageUrl;
}

/** Utility function to integrate new fields into the artwork object
 * using information provided by rendition assets from the DAMS
 *
 * Fields added include
 * - Renditions list from DAMS, including Archival Images
 * - Ensemble Image URL for the ensemble image that lives in NetX
 * - Published Provenance text
 * - Published Archives Reference text
 */
async function addAssetFields(artwork) {
  // Fetch the related asset from the DAMS
  const objectNumber = artwork._source.invno ? artwork._source.invno : null;
  const artworkAssets = await getAssetByObjectNumber(objectNumber);

  // We store the renditions but also aditional fields needed
  // for single artwork rendering
  const renditions = artworkAssets || [];
  const rendition = renditions[0];

  // Get the ensemble image url to use from the DAMS
  const ensembleImageUrl = artwork._source.ensembleIndex
    ? await getEnsembleImageUrl(artwork._source.ensembleIndex)
    : null;

  // Add new fields based on information from the DAMS
  artwork._source["ensembleImageUrl"] = ensembleImageUrl;
  artwork._source["renditions"] = renditions;
  artwork._source["publishedProvenance"] = rendition
    ? damsService.getValueFromAsset("Published Provenance (TMS)", rendition)
    : "";
  artwork._source["publishedArchivesReference"] = rendition
    ? damsService.getValueFromAsset(
        "Published Archives Reference (TMS)",
        rendition
      )
    : "";

  return artwork;
}

module.exports = {
  getAssetByObjectNumber,
  getAssetsForArtworks,
};

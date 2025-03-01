/** Service responsible for abstracting out the utilities for retrieving asset information for the Barnes Collection
 *  and caching the responses to avoid refetching object information that is needed frequently
 *
 */
const { DAMSService } = require("./damsService");
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

/** Sets the provided artwork asset into the cache
 * @param {string} objectNumber - The object number for the artwork
 * @returns {string} The cache key for the artwork, based on the object number
 */
function setArtworkInCache(objectNumber, artworkAsset) {
  const objectCacheKey = makeObjectCacheKey(objectNumber);
  memoryCache.put(objectCacheKey, artworkAsset, oneWeek);
  return objectCacheKey;
}

/** Get the requested artwork asset from the artwork cache
 * @param {string} objectNumber - The object number for the artwork
 * @returns {} The artwork asset from the cache
 */
function getArtworkFromCache(objectNumber) {
  const objectCacheKey = makeObjectCacheKey(objectNumber);
  return memoryCache.get(objectCacheKey);
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
  const artworkAsset = getArtworkFromCache(objectNumber);

  // If we don't have a cached version of this object asset
  // let's fetch it live, store it, then return it
  if (!artworkAsset) {
    const liveObjectAsset = await DAMSService.getFullAssetByObjectNumber(
      objectNumber
    );
    setArtworkInCache(objectNumber, liveObjectAsset);

    return liveObjectAsset;
  }

  // Otherwise, we have the cached version
  return artworkAsset;
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
    const cachedArtwork = getArtworkFromCache(artwork.objectNumber);

    // We have the cached version of the object, so let's persist it
    if (cachedArtwork) {
      artworkAssetsMap[artwork.objectId] = cachedArtwork;
    }
    // Otherwise, we need to request it from the DAMS
    else {
      console.debug(
        `[getAssetByObjectIds] Object Number ${artwork.objectNumber} does not yet exist in cache`
      );
      artworksToRequest.push(artwork);
    }
  });

  const objectIdsToRequest = artworksToRequest.map(({ objectId }) => objectId);
  const retrievedArtworkAssetsMap = await DAMSService.getAssetsByObjectIds(
    objectIdsToRequest
  );

  // We've retrieved the necessary artworks from the DAMS. Let's iterate through them
  // to add them to the artwork assets map, but more importantly, cache them for the next request
  artworksToRequest.forEach((artwork) => {
    const artworkAsset = retrievedArtworkAssetsMap[artwork.objectId];

    if (artworkAsset) {
      artworkAssetsMap[artwork.objectId] = artworkAsset;
      setArtworkInCache(artwork.objectNumber, artworkAsset);
    }
    // This means we did not receive assets we needed for an artwork, so we should log that
    else {
      console.warn(
        `[getAssetByObjectIds] Could not find artwork assets from the DAMS for Object Number ${artwork.objectNumber}`
      );

      // We'll set an empty array to keep type-safetiness, but also to help ensure
      // we don't continue to request out for artwork assets that do not exist
      artworkAssetsMap[artwork.objectId] = [];
      setArtworkInCache(artwork.objectNumber, []);
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
    if (artwork._source.id && artwork._source.invno) {
      collector.push({
        objectId: artwork._source.id,
        objectNumber: artwork._source.invno,
      });
    }
    return collector;
  }, []);

  // If we're fetching multiple artworks - then we typically do not need
  // archival renditions to be included in our response. So we're fine
  // with just this general assets call to get the display image
  if (artworks.length > 1) {
    // We iterate through each artwork from the original list and provide its renditions
    // by looking them up in the artwork assets map using the Object ID
    const artworkAssetsMap = await getAssetByObjectIds(artworksInformation);
    const artworksWithAssets = artworks.map((artwork) => {
      // Get the assets for this artwork and store them in our cache for later reuse
      const artworkAssets = artworkAssetsMap[artwork._source.id];
      artwork._source["renditions"] = artworkAssets;

      return artwork;
    });

    return artworksWithAssets;
  }

  // Otherwise, we're fetching a single artwork object's renditions
  // so we do need archive renditions as part of our asset information
  // We make this copy of the artwork object to not mutate existing objects
  const artwork = { ...artworks[0] };
  const objectNumber = artwork._source.invno ? artwork._source.invno : null;

  // Get the assets for this object number and use that to populate the fields
  const artworkAssets = await getAssetByObjectNumber(objectNumber);
  const artworkWithDAMSInformation = await addAssetFields(
    artwork,
    artworkAssets
  );

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
    const liveEnsembleImageUrl = await DAMSService.getEnsembleImageUrl(
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
async function addAssetFields(artwork, artworkAssets) {
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
    ? DAMSService.getValueFromAsset("Published Provenance (TMS)", rendition)
    : "";
  artwork._source["publishedArchivesReference"] = rendition
    ? DAMSService.getValueFromAsset(
        "Published Archives Reference (TMS)",
        rendition
      )
    : "";

  return artwork;
}

module.exports = {
  getAssetByObjectNumber,
  getAssetsForArtworks,

  // Cache related functions, mainly to be used by the NetX Sync Job
  getArtworkFromCache,
  setArtworkInCache,
};

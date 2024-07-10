/** Service responsible for abstracting out the utilities for retrieving asset information for the Barnes Collection
 *  and caching the responses to avoid refetching object information that is needed frequently
 *
 */
const damsService = require("./damsService");
const memoryCache = require("memory-cache");
const { oneWeek } = require("../constants/times");

const OBJECT_CACHE = "OBJECT_CACHE";
const ENSEMBLE_CACHE = "ENSEMBLE_CACHE";

function makeObjectCacheKey(objectNumber) {
  return `${OBJECT_CACHE}_${objectNumber}`;
}

function makeEnsembleCacheKey(ensembleIndex) {
  return `${ENSEMBLE_CACHE}_${ensembleIndex}`;
}
async function getAssetByObjectNumber(objectNumber) {
  const objectCacheKey = makeObjectCacheKey(objectNumber);
  const objectAsset = memoryCache.get(objectCacheKey);

  // If we don't have a cached version of this object asset
  // let's fetch it live, store it, then return it
  if (!objectAsset) {
    const liveObjectAsset = await damsService.getAssetByObjectNumber(
      objectNumber
    );
    memoryCache.put(objectCacheKey, liveObjectAsset, oneWeek);

    return liveObjectAsset;
  }

  // Otherwise, we have the cached version
  return objectAsset;
}

async function getAssetsForArtworks(artworks) {
  if (artworks.length === 0) {
    return artworks;
  }

  const artworksInformation = artworks.map((result) => {
    return {
      objectId: result._source.id,
      objectNumber: result._source.invno ? result._source.invno : null,
    };
  });

  // If we're fetching multiple artworks - then we typically do not need
  // archival renditions to be included in our response. So we're fine
  // with just this general assets call
  if (artworks.length > 1) {
    const objectIds = artworksInformation
      .map(({ objectId }) => objectId)
      .filter((objectId) => objectId);
    const artworkAssetsMap = await damsService.getAssetsByObjectIds(objectIds);

    return artworks.map((artwork) => {
      artwork._source["renditions"] =
        artworkAssetsMap[artwork._source.id] || [];
      return artwork;
    });
  }

  // Otherwise, we're fetching a single artwork object's renditions
  // so we do need archival renditions as part of our list
  // and need some extra work to do so
  const artwork = { ...artworks[0] };
  const artworkWithDAMSInformation = await addAssetFields(artwork);

  return [artworkWithDAMSInformation];
}

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

/** Service responsible for abstracting out the utilities for retrieving asset information for the Barnes Collection
 *  and caching the responses to avoid refetching object information that is needed frequently
 *
 */
const damsService = require("./damsService");
const memoryCache = require("memory-cache");
const { oneWeek } = require("../constants/times");
const { transformInvno } = require("../utils/transformInvno");

const OBJECT_CACHE = "OBJECT_CACHE";

function makeObjectCacheKey(objectNumber) {
  return `${OBJECT_CACHE}_${objectNumber}`;
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
      objectNumber: result._source.invno
        ? transformInvno(result._source.invno)
        : null,
    };
  });

  // If we're fetching multiple artworks - then we typically do not need
  // archival renditions to be included in our response. So we're fine
  // with just this general assets call
  if (artworksInformation.length > 1) {
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
  const { objectNumber } = artworksInformation[0];
  const artworkAssets = await getAssetByObjectNumber(objectNumber);

  // We store the renditions but also aditional fields needed
  // for single artwork rendering
  return artworks.map((artwork) => {
    const renditions = artworkAssets || [];
    const rendition = renditions[0];

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
  });
}

module.exports = {
  getAssetByObjectNumber,
  getAssetsForArtworks,
};

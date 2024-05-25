/** Service responsible for abstracting out the utilities for retrieving asset information for the Barnes Collection
 *  and caching the responses to avoid refetching object information that is needed frequently
 *
 */
const damsService = require("./damsService");
const memoryCache = require("memory-cache");
const { oneWeek } = require("../constants/times");

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

module.exports = {
  getAssetByObjectNumber,
};

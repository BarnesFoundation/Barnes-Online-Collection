const PRIMARY_DISPLAY_IMAGE_TMS_FIELD = "Primary Display Image (TMS)";
const PRIMARY_DISPLAY_IMAGE_VALUE = "Primary Display Image";
const OBJECT_ID_TMS_FIELD = "ObjectID (TMS)";
const SYNC_TYPE_FIELD = "Sync Type";
const ARCHIVE_SYNC_TYPE_VALUE = "Archives Sync";

/** Sorts a list of assets to resulting in the Primary Display Image being
 * shown first in the asset list, followed by non-Primary Display Images
 * and lastly, Archive Images being placed at the end of list
 */
function sortAssets(assets) {
  if (assets.length === 0) {
    return assets;
  }
  const sortedAssets = [...assets];

  // We'll search through the results and put the Primary Display Image first
  // Look for the primary image. It is possible there is none specified
  const primaryImageIndex = assets.findIndex((asset) => {
    const primaryDisplayImageValue = getValueFromNetXAttribute(
      PRIMARY_DISPLAY_IMAGE_TMS_FIELD,
      asset
    );

    return primaryDisplayImageValue === PRIMARY_DISPLAY_IMAGE_VALUE;
  });

  // Shift the primary image to the front
  if (primaryImageIndex > -1) {
    const primaryResultItem = sortedAssets.splice(primaryImageIndex, 1)[0];
    sortedAssets.unshift(primaryResultItem);
  }

  // By now, we've sorted the primary image to the front, if one existed
  // Let's check if there's any Archive Correspondence and shift it to the end
  const { artworks, archives } = sortedAssets.reduce(
    (acc, asset) => {
      const syncTypeValue = getValueFromNetXAttribute(SYNC_TYPE_FIELD, asset);

      // It's an archive
      if (syncTypeValue === ARCHIVE_SYNC_TYPE_VALUE) {
        // TODO - Remove the below commentation once we fix archive image rendering
        // acc.archives.push(asset);
        return acc;
      }

      // Otherwise, it's an artwork
      acc.artworks.push(asset);
      return acc;
    },
    { artworks: [], archives: [] }
  );

  // Combine the two lists with the Archival Correspondences to the end
  return artworks.concat(archives);
}

/** Groups a flat list of assets to a map of `{ [objectId: string]: Array<asset>} `
 * where a list of several asset images can belong to each object id
 */
function groupAssets(assets) {
  const groupedAssets = assets.reduce((collector, asset) => {
    const { attributes } = asset;
    if (!attributes) {
      return collector;
    }

    const objectId = getValueFromNetXAttribute(OBJECT_ID_TMS_FIELD, asset);
    if (!objectId) {
      return collector;
    }

    // Store this asset in a list under the Object ID of the asset
    if (!collector[objectId]) {
      collector[objectId] = [];
    }
    collector[objectId].push(asset);

    return collector;
  }, {});

  // Now that we have all the assets, let's sort the primary image to be first
  const sortedGroupedAssets = Object.entries(groupedAssets).reduce(
    (collector, [objectId, assets]) => {
      collector[objectId] = sortAssets(assets);
      return collector;
    },
    {}
  );

  return sortedGroupedAssets;
}

function getValueFromNetXAttribute(attributeName, asset) {
  const attributeValueList =
    asset.attributes && asset.attributes[attributeName]
      ? asset.attributes[attributeName]
      : [];
  const attributeValue =
    attributeValueList && attributeValueList.length
      ? attributeValueList[0]
      : "";

  return attributeValue;
}

module.exports = {
  sortAssets,
  groupAssets,
  getValueFromNetXAttribute,
};

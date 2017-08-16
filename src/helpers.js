export const getArtObjectUrlFromId = (objectId, slug) => {
  slug = slug || '';

  return `/objects/${objectId}/${slug}`;
}

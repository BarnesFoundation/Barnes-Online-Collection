import { META_TITLE } from './constants';

export const getArtObjectUrlFromId = (objectId, slug) => {
  slug = slug || '';

  return `/objects/${objectId}/${slug}`;
}

export const getMetaTagsFromObject = (object) => {
  const metaTitle = `${META_TITLE} — ${object.culture || object.people}: ${object.title}`;
  const metaImage = object.imageUrlSmall;

  if (!object || !object.id) {
    return null;
  }

  return {
    title: metaTitle,
    image: metaImage,
  };
}


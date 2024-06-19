import bodybuilder from "bodybuilder";
import { BARNES_SETTINGS } from "./barnesSettings";
import { META_TITLE, META_DESCRIPTION } from "./constants";
import { ui } from "./shared/config";

const slugify = require("slugify");

export const getArtObjectUrlFromId = (objectId, objectTitle, panelSlug) => {
  // this can happen while the data is loading
  if (!objectId) {
    return null;
  }

  const titleSlug = slugify(objectTitle);

  panelSlug = panelSlug || "";

  return `/objects/${objectId}/${titleSlug}/${panelSlug}`;
};

export const getMetaTagsFromObject = (object) => {
  const artistOrCulture = object.culture || object.people;
  const metaTitle = `${META_TITLE} — ${artistOrCulture}: ${object.title}`;
  const metaImage = object.imageUrlSmall;
  const metaDescription = `Barnes Foundation Collection: ${artistOrCulture}. ${object.title} -- ${META_DESCRIPTION}`;

  if (!object || !object.id) {
    return null;
  }

  return {
    title: metaTitle,
    image: metaImage,
    description: metaDescription,
  };
};

export const getObjectRequestBody = (object) => {
  let body = bodybuilder().filter("exists", "imageSecret").from(0).size(25);

  return body;
};

export const getObjectsRequestBody = (fromIndex = 0, isLocation = false) => {
  let body = bodybuilder()
    .sort("_score", "desc")
    .filter("exists", "imageSecret")
    .from(fromIndex)
    .size(isLocation ? 10000 : BARNES_SETTINGS.size);
  return body;
};

export const getQueryUrl = (qtype, qval) => {
  return `/objects/?qtype=${qtype}&qval=${qval}`;
};

export const getQueryKeywordUrl = (qval) => {
  return getQueryUrl("keyword", qval);
};

export const getQueryFilterUrl = (qval) => {
  return getQueryUrl("filter", qval);
};

/** Gets the URL for rendering the specified image type from the rendition */
export const getImageURLFromRendition = (rendition, imageType) => {
  const imageProxy = rendition.proxies.find(
    (proxy) => proxy.name === imageType
  );

  if (!imageProxy) {
    return "";
  }

  return `${ui.netxBaseURL}${imageProxy.file.url}`;
};

/** Determines if renditions from NetX should be rendered
 * TODO - Move to config file
 */
export const NETX_ENABLED =
  process.env.REACT_APP_NETX_ENABLED === "true" ? true : false;

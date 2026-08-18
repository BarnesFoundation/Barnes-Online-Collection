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

const cfImageBase = ui.imagesPrefix
  ? `${ui.imageBaseURL}/${ui.imagesPrefix}`
  : ui.imageBaseURL;

/** Gets the URL for rendering the specified image type from the rendition */
export const getImageURLFromRendition = (rendition, imageType) => {
  // Carousel images sourced from the V2 store (CloudFront-tiled by enrichImages), not live NetX.
  // `${objectId}_${secret}_{n|b}.jpg` matches the primary-image URL convention (objectDataUtils).
  if (rendition._cf) {
    const suffix = imageType === "Thumbnail" ? "n" : "b"; // Zoom/Preview → the 1024 preview
    return `${cfImageBase}/${rendition.objectId}_${rendition.secret}_${suffix}.jpg`;
  }

  const imageProxy = rendition.proxies.find(
    (proxy) => proxy.name === imageType
  );

  if (!imageProxy) {
    return "";
  }

  return `${ui.netxBaseURL}${imageProxy.file.url}/`;
};

/**
 * Build the accessibility text alternatives for a carousel image (WCAG 1.1.1).
 * Returns a concise `alt` (accessible name for the <img>/viewer) plus, for images of text
 * (letters/documents), the full `longText` to surface visibly on the page and associate via
 * aria-describedby — never stuff a whole transcription into an alt attribute.
 *
 * Tiering: transcription (image of text) → archival description → visual description → name.
 */
export const getImageA11y = (rendition, object = {}) => {
  const nameFallback = object.people
    ? `${object.people}. ${object.title || ""}`.trim()
    : object.title || "";
  if (!rendition) {
    return { alt: nameFallback, longText: "", longKind: "", note: "" };
  }
  const caption =
    (rendition.attributes &&
      (rendition.attributes["Archives Correspondence Caption"]?.[0] ||
        rendition.attributes["Artwork Caption (TMS)"]?.[0])) ||
    "";
  const note = rendition.accessibilityNote || "";
  if (rendition.transcription) {
    return { alt: caption || nameFallback, longText: rendition.transcription, longKind: "Transcription", note };
  }
  if (rendition.isArchive && rendition.description) {
    return { alt: caption || rendition.description, longText: rendition.description, longKind: "Description", note };
  }
  // Artwork: the (curator or fallback) visual description is concise enough to serve as the alt.
  return { alt: rendition.description || caption || nameFallback, longText: "", longKind: "", note };
};

/** Determines if renditions from NetX should be rendered
 * TODO - Move to config file
 */
export const NETX_ENABLED =
  process.env.REACT_APP_NETX_ENABLED === "true" ? true : false;

const { ui } = require("../config");

const imageUrlBase = ui.imagesPrefix
  ? `${ui.imageBaseURL}/${ui.imagesPrefix}`
  : ui.imageBaseURL;

const generateObjectImageUrls = (object) => {
  // temp fix for imageSecret missing on some images
  if (!object) {
    return {};
  }

  if (!object.imageSecret) {
    return object;
  }

  const canonicalRoot = process.env.REACT_APP_CANONICAL_ROOT || "";
  const canonicalRootNoProt = canonicalRoot.replace(/^https?:\/\//i, "");
  // Clone existing object
  const newObject = Object.assign({}, object);
  const imageTrackBaseUrl = `/track/image-download/`;
  const imageIdReg = `${object.id}_${object.imageSecret}`;
  const imageIdOrig = `${object.id}_${object.imageOriginalSecret}`;

  // Construct image urls for object with updated url roots
  newObject.imageUrlSmall = `${imageUrlBase}/${imageIdReg}_n.jpg`;
  newObject.imageUrlOriginal = `${imageUrlBase}/${imageIdOrig}_o.jpg`;
  newObject.imageUrlLarge = `${imageUrlBase}/${imageIdReg}_b.jpg`;
  newObject.imageUrlForWufoo = `${canonicalRootNoProt}${imageTrackBaseUrl}${imageIdOrig}`;

  // Responsive + modern-format sources for the grid <picture> (enrichGridFormats generates
  // _m 640 + WebP/AVIF at 640/1024). The browser picks the smallest FORMAT it supports (AVIF→WebP→
  // JPG) and, within it, the right SIZE for the slot × DPR. The <img> JPG srcset is the fallback and
  // works even before the modern derivatives exist.
  const gs = `${imageUrlBase}/${imageIdReg}`;
  newObject.gridSources = {
    avif: `${gs}_m.avif 640w, ${gs}_b.avif 1024w`,
    webp: `${gs}_m.webp 640w, ${gs}_b.webp 1024w`,
    jpg: `${gs}_n.jpg 320w, ${gs}_m.jpg 640w, ${gs}_b.jpg 1024w`,
  };

  return newObject;
};

const sanitizeEnsembleIndex = (object) => {
  let index = object.ensembleIndex;

  // Update the ensemble index
  object.ensembleIndex = index ? index.split(",")[0] : null;

  return object;
};

const parseObject = (object) => {
  object = generateObjectImageUrls(object);
  object = sanitizeEnsembleIndex(object);

  return object;
};

module.exports = {
  generateObjectImageUrls,
  parseObject,
};

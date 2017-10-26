const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
const IMAGES_PREFIX = process.env.REACT_APP_IMAGES_PREFIX;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;

const generateObjectImageUrls = (object) => {
  // temp fix for imageSecret missing on some images
  if (!object) {
    return {};
  }

  if (!object.imageSecret) {
    return object;
  }

  const wufooImageKeyPrefix = `s3.amazonaws.com/${AWS_BUCKET}/${IMAGES_PREFIX}`;
  const imageUrlBase = `${IMAGE_BASE_URL}/${IMAGES_PREFIX}`;
  const newObject = Object.assign({}, object);

  newObject.imageUrlSmall = `${imageUrlBase}/${object.id}_${object.imageSecret}_n.jpg`;
  newObject.imageUrlOriginal = `${imageUrlBase}/${object.id}_${object.imageOriginalSecret}_o.jpg`;
  newObject.imageUrlLarge = `${imageUrlBase}/${object.id}_${object.imageSecret}_b.jpg`;
  newObject.imageUrlForWufoo = `${wufooImageKeyPrefix}/${object.id}_${object.imageOriginalSecret}`;

  return newObject;
}

const sanitizeEnsembleIndex = (object) => {
  let index = object.ensembleIndex;

  object.ensembleIndex = index ? index.split(',')[0] : null;

  return object;
}

export const parseObject = (object) => {
  object = generateObjectImageUrls(object);
  object = sanitizeEnsembleIndex(object);

  return object;
}

// todo: deduplicate #imgUrlLogic
const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
const IMAGES_PREFIX = process.env.REACT_APP_IMAGES_PREFIX;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || `//s3.amazonaws.com/${AWS_BUCKET}`;
const imageUrlBase = IMAGES_PREFIX ? `${IMAGE_BASE_URL}/${IMAGES_PREFIX}` : IMAGE_BASE_URL;
const ENSEMBLE = require('./ensembleIndexes');

export const ENSEMBLE_IMAGE_URL = (index) => {
  return `${imageUrlBase}/ensembles/${index}.jpg`;
}

export const getRoomAndTitleText = (ensembleIndex) => {
  const wallTitle = ENSEMBLE[ensembleIndex].wallTitle;
  const wallTitleStr = wallTitle ? `, ${wallTitle}` : '';

  return `${ENSEMBLE[ensembleIndex].roomTitle}${wallTitleStr}`;
}

export const getRoomName = (ensembleIndex) => {
  return ENSEMBLE[ensembleIndex].roomTitle;
};
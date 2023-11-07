import { ui } from './shared/config';

// TODO - These are used quite a bite throughout codebase. Possibly move to `/shared` directory somewhere
const IMAGES_PREFIX = ui.imagesPrefix;
const IMAGE_BASE_URL = ui.imageBaseURL;
const imageUrlBase = IMAGES_PREFIX ? `${IMAGE_BASE_URL}/${IMAGES_PREFIX}` : IMAGE_BASE_URL;
const ENSEMBLE = require('./ensembleIndexes');

export const ENSEMBLE_IMAGE_URL = (index) => {
  return `${imageUrlBase}/ensembles/${index}.jpg`;
}

export const getRoomAndTitleText = (ensembleIndex) => {
  const ensembleInfo = ENSEMBLE[ensembleIndex];
  if (!ensembleInfo) return '';

  const wallTitle = ensembleInfo.wallTitle;
  const wallTitleStr = wallTitle ? `, ${wallTitle}` : '';

  return `${ensembleInfo.roomTitle}${wallTitleStr}`;
}

export const getRoomName = (ensembleIndex) => {
  return ENSEMBLE[ensembleIndex] ? ENSEMBLE[ensembleIndex].roomTitle : '';
};
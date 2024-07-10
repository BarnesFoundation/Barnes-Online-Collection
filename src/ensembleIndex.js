import { ui } from "./shared/config";

// TODO - These are used quite a bite throughout codebase. Possibly move to `/shared` directory somewhere
const IMAGES_PREFIX = ui.imagesPrefix;
const IMAGE_BASE_URL = ui.imageBaseURL;
const imageUrlBase = IMAGES_PREFIX
  ? `${IMAGE_BASE_URL}/${IMAGES_PREFIX}`
  : IMAGE_BASE_URL;
const ENSEMBLE = require("./ensembleIndexes");

export const ENSEMBLE_IMAGE_URL = (index) => {
  return `${imageUrlBase}/ensembles/${index}.jpg`;
};

export const getRoomAndTitleText = (ensembleIndex) => {
  const ensembleInfo = ENSEMBLE[ensembleIndex];
  if (!ensembleInfo) return "";

  const wallTitle = ensembleInfo.wallTitle;
  const wallTitleStr = wallTitle ? `, ${wallTitle}` : "";

  return `${ensembleInfo.roomTitle}${wallTitleStr}`;
};

export const getRoomName = (ensembleIndex) => {
  return ENSEMBLE[ensembleIndex] ? ENSEMBLE[ensembleIndex].roomTitle : "";
};

const ENSEMBLE_IMAGE_PREFIX = "bfp";
const ENSEMBLE_IMAGE_POSTFIX = "_clean.jpg";

const MAIN_ROOM_INDICES = ["1", "2", "3", "4"];
const BALCONY_MAP = {
  ["94"]: `${ENSEMBLE_IMAGE_PREFIX} balcony east${ENSEMBLE_IMAGE_POSTFIX}`,
  ["95"]: null,
  ["96"]: `${ENSEMBLE_IMAGE_PREFIX} balcony west${ENSEMBLE_IMAGE_POSTFIX}`,
};

const MEZZANINE_INDICES = ["97", "98", "99", "100"];
const GALLERY_FOYER_INDICES = ["101", "102", "103", "104"];
const LOWER_LOBBY_INDICES = ["105", "106", "107", "108"];
const LE_BONHEUR_INDEX = "93";

export const getAssetFileNameForDAMS = (ensembleIndex) => {
  const ensembleInfo = ENSEMBLE[ensembleIndex];
  if (!ensembleInfo) return null;

  // Handle special case for balcony asset file name
  // since balcony asset file names do not contain the room number
  if (BALCONY_MAP.hasOwnProperty(ensembleIndex)) {
    return BALCONY_MAP[ensembleIndex];
  }

  // Handle special case for Joy of Life asset file name
  // since the file name does not contain a room number
  if (ensembleIndex === LE_BONHEUR_INDEX) {
    return `${ENSEMBLE_IMAGE_PREFIX} joy of life n${ENSEMBLE_IMAGE_POSTFIX}`;
  }

  // TODO - Fix Mezzanine file names. FOr now, we'll return null
  if (MEZZANINE_INDICES.includes(ensembleIndex)) {
    return null;
  }

  // TODO - Fix Gallery Foyer file names. FOr now, we'll return null
  if (GALLERY_FOYER_INDICES.includes(ensembleIndex)) {
    return null;
  }

  // TODO - Fix Lower Lobby file names. FOr now, we'll return null
  if (LOWER_LOBBY_INDICES.includes(ensembleIndex)) {
    return null;
  }

  const { roomTitle, wallTitle } = ensembleInfo;

  // For the below ensemble indices, we can construct the file name using the room and wall

  // Handle "Main Room", since all other room titles are "Room [X]"
  // Ensemble indexes 1, 2, 3, 4 are "Main Room", which is Room 1
  let roomNumber;
  if (MAIN_ROOM_INDICES.includes(ensembleIndex)) {
    roomNumber = "1";
  } else {
    [, roomNumber] = roomTitle.split(" ");
  }

  const wallCharacter = wallTitle[0];
  if (!roomNumber || !wallCharacter) return null;

  // The Asset Name for each Ensemble Image in NetX appears to be something
  // like `bfp[Room Number][Wall Title]_clean.jpg`. So for example, Room 20 - East Wall
  // would have a file name like `bfp20e_clean.jpg`.
  const assetFileName = ENSEMBLE_IMAGE_PREFIX.concat(roomNumber)
    .concat(wallCharacter.toLowerCase())
    .concat(ENSEMBLE_IMAGE_POSTFIX);

  return assetFileName;
};

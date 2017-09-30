import * as ActionTypes from '../constants';

const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
const AWS_PREFIX = process.env.REACT_APP_IMAGES_PREFIX;

export const generateObjectImageUrls = (object) => {
  // temp fix for imageSecret missing on some images
  if (!object) {
    return {};
  }

  if (!object.imageSecret) {
    return object;
  }

  const awsUrlWithoutProt = `s3.amazonaws.com/${AWS_BUCKET}/${AWS_PREFIX}`;
  const awsUrl = `https://${awsUrlWithoutProt}`;
  const newObject = Object.assign({}, object);

  newObject.imageUrlSmall = `${awsUrl}/${object.id}_${object.imageSecret}_n.jpg`;
  newObject.imageUrlOriginal = `${awsUrl}/${object.id}_${object.imageOriginalSecret}_o.jpg`;
  newObject.imageUrlForWufoo = `${awsUrlWithoutProt}/${object.id}_${object.imageOriginalSecret}`;
  newObject.imageUrlLarge = `${awsUrl}/${object.id}_${object.imageSecret}_b.jpg`;

  return newObject;
}

export const ensembleObjects = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_ENSEMBLE_OBJECTS:
      return action.payload.map(object => {
        return generateObjectImageUrls(object)
      });
    default:
      return state;
  }
};

export default ensembleObjects;

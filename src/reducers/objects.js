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
  const baseUrl = `https://s3.amazonaws.com/${AWS_BUCKET}/${AWS_PREFIX}`;
  const newObject = Object.assign({}, object);
  newObject.imageUrlSmall = `${baseUrl}/${object.id}_${object.imageSecret}_n.jpg`;
  newObject.imageUrlLarge = `${baseUrl}/${object.id}_${object.imageSecret}_b.jpg`;
  return newObject;
}

const dedupeObjects = (objects) => {
  let hashTable = {};

  return objects.filter(function(el) {
    let key = JSON.stringify(el);
    let match = Boolean(hashTable[key]);

    return (match ? false : hashTable[key] = true);
  });
}

const objects = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_OBJECTS:
      return action.payload.map(object => generateObjectImageUrls(object));
    case ActionTypes.APPEND_OBJECTS:
      const newObjects = action.payload.map(object => generateObjectImageUrls(object));
      return dedupeObjects(state.concat(newObjects));
    default:
      return state;
  }
};

export default objects;

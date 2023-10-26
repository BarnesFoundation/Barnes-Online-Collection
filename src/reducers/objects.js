import * as ActionTypes from "../constants";
import { parseObject } from "../objectDataUtils";

const dedupeObjects = (objects) => {
  let hashTable = {};

  return objects.filter(function (object) {
    let key = object.id;
    let match = Boolean(hashTable[key]);

    return match ? false : (hashTable[key] = true);
  });
};

const getObjectsPayload = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.SET_OBJECTS:
      return action.payload.map((object) => parseObject(object));
    case ActionTypes.APPEND_OBJECTS: {
      const newObjects = action.payload.map((object) => parseObject(object));
      return dedupeObjects(state.concat(newObjects));
    }
    default:
      return state;
  }
};

export const objects = (state = [], action) => {
  return getObjectsPayload(state, action);
};

export default objects;

import * as ActionTypes from '../constants';
import { parseObject } from '../objectDataUtils';

const relatedObjects = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_RELATED_OBJECTS:
      return action.payload.map(object => {
        return parseObject(object)
      });
    default:
      return state;
  }
};

export default relatedObjects;

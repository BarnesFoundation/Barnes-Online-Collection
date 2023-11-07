import * as ActionTypes from '../constants';
import { parseObject } from '../shared/utils';

const relatedObjects = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_RELATED_OBJECTS:
      return action.payload.map(object => {
        return parseObject(object)
      });
    case ActionTypes.CLEAR_RELATED_OBJECTS:
      return [];
    default:
      return state;
  }
};

export default relatedObjects;

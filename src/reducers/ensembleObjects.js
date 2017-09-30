import * as ActionTypes from '../constants';
import { parseObject } from '../objectDataUtils';

export const ensembleObjects = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_ENSEMBLE_OBJECTS:
      return action.payload.map(object => {
        return parseObject(object)
      });
    default:
      return state;
  }
};

export default ensembleObjects;

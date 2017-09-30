import * as ActionTypes from '../constants';
import { parseObject } from '../objectDataUtils';

const object = (state = {}, action) => {
  switch(action.type) {
    case ActionTypes.SET_OBJECT:
      return parseObject(action.payload);
    default:
      return state;
  }
};

export default object;

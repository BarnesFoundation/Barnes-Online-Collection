import * as ActionTypes from '../constants';
import { generateObjectImageUrls } from './objects';

const object = (state = {}, action) => {
  switch(action.type) {
    case ActionTypes.SET_OBJECT:
      return generateObjectImageUrls(action.payload);
    default:
      return state;
  }
};

export default object;

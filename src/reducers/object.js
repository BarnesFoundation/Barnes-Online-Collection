import * as ActionTypes from "../constants";
import { parseObject } from "../shared/utils";

const object = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_OBJECT:
      return parseObject(action.payload);
    case ActionTypes.CLEAR_OBJECT:
      return {};
    default:
      return state;
  }
};

export default object;

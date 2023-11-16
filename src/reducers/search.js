import * as ActionTypes from "../constants";

const search = (state = "", action) => {
  switch (action.type) {
    case ActionTypes.ADD_SEARCH_TERM:
      return action.term;
    case ActionTypes.CLEAR_SEARCH_TERM:
      return "";
    default:
      return state;
  }
};

export default search;

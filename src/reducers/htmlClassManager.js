import * as ActionTypes from "../constants";

const initialState = [];

const addClass = (state, action) => {
  // remove first to avoid duplicate classes
  const normalizedState = removeClass(state, action);
  return [...normalizedState, action.payload];
};

const removeClass = (state, action) => {
  return state.filter((tag) => tag !== action.payload);
};

const toggleClass = (state, action) => {
  var hasClass = state.indexOf(action.payload) > -1;
  return hasClass ? removeClass(state, action) : addClass(state, action);
};

const htmlClassManager = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.HTML_CLASSES_RESET:
      return action.payload || initialState;
    case ActionTypes.HTML_CLASSES_ADD:
      return addClass(state, action);
    case ActionTypes.HTML_CLASSES_TOGGLE:
      return toggleClass(state, action);
    case ActionTypes.HTML_CLASSES_REMOVE:
      return removeClass(state, action);
    default:
      return state;
  }
};

export default htmlClassManager;

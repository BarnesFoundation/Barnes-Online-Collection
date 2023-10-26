import * as ActionTypes from "../constants";

const initialState = {
  visible: false,
};

const mobileSearch = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_MOBILE_SEARCH:
      return Object.assign({}, state, { visible: true });
    case ActionTypes.CLOSE_MOBILE_SEARCH:
      return Object.assign({}, state, { visible: false });
    default:
      return state;
  }
};

export default mobileSearch;

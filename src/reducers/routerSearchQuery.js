import * as ActionTypes from '../constants';

const initialState = {
  hasInitialized: false,
};

const routerSearchQuery = (state=initialState, action) => {
  switch(action.type) {
    case ActionTypes.ROUTER_SEARCH_INIT:
      return Object.assign({}, state, { hasInitialized: true });
    default:
      return state;
  }
};

export default routerSearchQuery;

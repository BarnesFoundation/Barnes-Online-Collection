import * as ActionTypes from '../constants';

const initialState = {
  maxHits: null,
  lastIndex: null,
  isPending: null,
};

const searchResults = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SEARCH_SET_LAST_INDEX:
      return Object.assign({}, state, {
        lastIndex: action.lastIndex
      });
    case ActionTypes.SEARCH_SET_MAX_HITS:
      return Object.assign({}, state, {
        maxHits: action.maxHits
      });
    case ActionTypes.SEARCH_SET_IS_PENDING:
      return Object.assign({}, state, {
        isPending: action.isPending
      });
    default:
      return state;
  }
}

export default searchResults;

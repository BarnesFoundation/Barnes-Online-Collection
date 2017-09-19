import * as ActionTypes from '../constants';

const initialState = {
  maxHits: null,
  lastIndex: null,
  isPending: null,
};

const queryResults = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.QUERY_SET_LAST_INDEX:
      return Object.assign({}, state, {
        lastIndex: action.lastIndex
      });
    case ActionTypes.QUERY_SET_MAX_HITS:
      return Object.assign({}, state, {
        maxHits: action.maxHits
      });
    case ActionTypes.QUERY_SET_IS_PENDING:
      return Object.assign({}, state, {
        isPending: action.isPending
      });
    default:
      return state;
  }
}

export default queryResults;

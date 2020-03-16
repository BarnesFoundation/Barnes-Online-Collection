import {
  OBJECTS_QUERY_SET_HAS_MORE_RESULTS,
  OBJECTS_QUERY_SET_LAST_INDEX,
  OBJECTS_QUERY_SET_IS_PENDING,
  OBJECTS_QUERY_CURRENT_INDEX,
} from '../constants';

const initialState = {
  hasMoreResults: null,
  lastIndex: null,
  isPending: null,
  currentIndex: 0,
};

const objectsQuery = (state = initialState, action) => {
  switch(action.type) {
    case OBJECTS_QUERY_SET_HAS_MORE_RESULTS: return Object.assign({}, state, { hasMoreResults: action.hasMoreResults });
    case OBJECTS_QUERY_SET_LAST_INDEX: return Object.assign({}, state, { lastIndex: action.lastIndex });
    case OBJECTS_QUERY_SET_IS_PENDING: return Object.assign({}, state, { isPending: action.isPending });
    case OBJECTS_QUERY_CURRENT_INDEX: return { ...state, currentIndex: action.currentIndex };
    default: return state;
  }
}

export default objectsQuery;

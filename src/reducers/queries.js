import * as ActionTypes from '../constants';

const queries = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.APPEND_TO_QUERIES:
      return [...state, action.payload];
    case ActionTypes.REMOVE_FROM_QUERIES:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
    default:
      return state;
  }
}

export default queries;

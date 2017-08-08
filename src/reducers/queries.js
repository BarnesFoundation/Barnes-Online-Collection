import * as ActionTypes from '../constants';

const queries = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.APPEND_TO_QUERIES:
      return [...state, action.payload];
    default:
      return state;
  }
}

export default queries;

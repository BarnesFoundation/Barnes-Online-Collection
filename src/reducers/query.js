import * as ActionTypes from '../constants';

const query = (state = '', action) => {
  switch(action.type) {
    case ActionTypes.SET_QUERY:
      return action.payload;
    case ActionTypes.APPEND_TO_QUERY:
      return `${state} ${action.payload}`.trim();
    default:
      return state;
  }
}

export default query;

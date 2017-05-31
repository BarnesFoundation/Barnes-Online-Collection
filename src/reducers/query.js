import * as ActionTypes from '../constants';

const query = (state = '', action) => {
  switch(action.type) {
    case ActionTypes.SET_QUERY:
      return action.payload;
    default:
      return state;
  }
}

export default query;

import * as ActionTypes from '../constants';

const search = (state = '', action) => {
  switch(action.type) {
    case ActionTypes.SEARCH:
      return action.term;
    case ActionTypes.CLEAR_SEARCH:
      return '';
    default:
      return state;
  }
}

export default search;

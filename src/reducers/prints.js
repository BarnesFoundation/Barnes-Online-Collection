import * as ActionTypes from '../constants';

const prints = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.SET_PRINTS:
      return action.payload;
    default:
      return state;
  }
};

export default prints;

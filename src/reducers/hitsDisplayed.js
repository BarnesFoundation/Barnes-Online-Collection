import * as ActionTypes from '../constants';

const initialState = {
  maxHits: null,
  lastIndex: null,
};

const hitsDisplayed = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SET_LAST_INDEX:
      return Object.assign({}, state, {
        lastIndex: (action.idxFrom + action.size)
      });
    case ActionTypes.SET_MAX_HITS:
      return Object.assign({}, state, {
        maxHits: action.maxHits
      });
    default:
      return state;
  }
}

export default hitsDisplayed;

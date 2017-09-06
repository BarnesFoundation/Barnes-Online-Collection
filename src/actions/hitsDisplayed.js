import * as ActionTypes from '../constants';

export const setLastIndex = (lastIndex) => {
  return {
    type: ActionTypes.SET_LAST_INDEX,
    lastIndex: lastIndex
  };
}

export const setMaxHits = (maxHits) => {
  return {
    type: ActionTypes.SET_MAX_HITS,
    maxHits: maxHits
  };
}

import * as ActionTypes from '../constants';

export const setLastIndex = (idxFrom, size) => {
  return {
    type: ActionTypes.SET_LAST_INDEX,
    idxFrom: idxFrom,
    size: size
  };
}

export const setMaxHits = (maxHits) => {
  return {
    type: ActionTypes.SET_MAX_HITS,
    maxHits: maxHits
  };
}

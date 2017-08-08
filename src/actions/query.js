import * as ActionTypes from '../constants';

export function setQuery(query) {
  return {
    type: ActionTypes.SET_QUERY,
    payload: query
  }
}

export function appendToQuery(word) {
  return {
    type: ActionTypes.APPEND_TO_QUERY,
    payload: word
  }
}

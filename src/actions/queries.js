import * as ActionTypes from '../constants';

export function appendToQueries(query) {
  return {
    type: ActionTypes.APPEND_TO_QUERIES,
    payload: query
  }
}

export function removeFromQueries(queryIndex) {
  return {
    type: ActionTypes.REMOVE_FROM_QUERIES,
    payload: queryIndex
  }
}

import * as ActionTypes from '../constants';

export function addToQueries(query) {
  return {
    type: ActionTypes.ADD_TO_QUERIES,
    payload: query
  }
}

export function removeFromQueries(queryIndex) {
  return {
    type: ActionTypes.REMOVE_FROM_QUERIES,
    payload: queryIndex
  }
}

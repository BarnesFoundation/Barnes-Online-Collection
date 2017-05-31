import * as ActionTypes from '../constants';

export function setQuery(query) {
  return {
    type: ActionTypes.SET_QUERY,
    payload: query
  }
}

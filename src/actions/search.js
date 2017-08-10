import * as ActionTypes from '../constants';

export function search(term) {
  return {
    type: ActionTypes.SEARCH,
    term: term
  }
}

export function clearSearch() {
  return {
    type: ActionTypes.CLEAR_SEARCH
  }
}

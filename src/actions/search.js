import * as ActionTypes from '../constants'

export function addSearchTerm (term) {
  return {
    type: ActionTypes.ADD_SEARCH_TERM,
    term: term
  }
}

export function clearSearchTerm () {
  return {
    type: ActionTypes.CLEAR_SEARCH_TERM
  }
}

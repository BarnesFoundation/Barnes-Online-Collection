import * as ActionTypes from '../constants';

export function addFilter(filter) {
  return {
    type: ActionTypes.ADD_FILTER,
    filter: filter
  }
}

export function shuffleFilters() {
  return {
    type: ActionTypes.SHUFFLE_FILTERS
  }
}

export function removeFilter(filter) {
  return {
    type: ActionTypes.REMOVE_FILTER,
    filter: filter
  }
}

export function clearAllFilters() {
  return {
    type: ActionTypes.CLEAR_ALL_FILTERS
  }
}

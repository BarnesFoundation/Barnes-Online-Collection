import * as ActionTypes from '../constants';

export function addFilter(filter) {
  return {
    type: ActionTypes.ADD_FILTER,
    filter: filter
  }
}

export function shuffleFilters(filters) {
  return {
    type: ActionTypes.SHUFFLE_FILTERS,
    filters: filters
  }
}

export function removeFilter(filter) {
  return {
    type: ActionTypes.REMOVE_FILTER,
    filter: filter
  }
}

export function removeFilterByIndex(index) {
  return {
    type: ActionTypes.REMOVE_FILTER_BY_INDEX,
    index: index
  }
}

export function removeFilterBySlug(slug) {
  return {
    type: ActionTypes.REMOVE_FILTER_BY_SLUG,
    slug: slug
  }
}

export function clearAllFilters() {
  return {
    type: ActionTypes.CLEAR_ALL_FILTERS
  }
}

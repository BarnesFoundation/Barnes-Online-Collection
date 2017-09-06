import * as ActionTypes from '../constants';

export function addColorFilter(filter) {
  return {
    type: ActionTypes.ADD_COLOR_FILTER,
    filter: filter
  }
}

export function removeColorFilter(filter) {
  return {
    type: ActionTypes.REMOVE_COLOR_FILTER,
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

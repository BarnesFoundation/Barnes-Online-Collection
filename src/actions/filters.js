import * as ActionTypes from '../constants';

export function addToFilters(filter) {
  return {
    type: ActionTypes.ADD_TO_FILTERS,
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

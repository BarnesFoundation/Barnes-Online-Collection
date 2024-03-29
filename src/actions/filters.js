import * as ActionTypes from "../constants";

export function addFilter(filter) {
  return {
    type: ActionTypes.ADD_FILTER,
    filter: filter,
  };
}

export function setFilters(filters) {
  return {
    type: ActionTypes.SET_FILTERS,
    filters: filters,
  };
}

export function removeFilter(filter) {
  return {
    type: ActionTypes.REMOVE_FILTER,
    filter: filter,
  };
}

export function clearAllFilters() {
  return {
    type: ActionTypes.CLEAR_ALL_FILTERS,
  };
}

// Actions for advanced filtering.
export const addAdvancedFilter = (filter) => ({
  type: ActionTypes.ADD_ADVANCED_FILTER,
  filter,
});
export const removeAdvancedFilter = (filter) => ({
  type: ActionTypes.REMOVE_ADVANCED_FILTER,
  filter,
});
export const setAdvancedFilters = (advancedFilters) => ({
  type: ActionTypes.SET_ADVANCED_FILTERS,
  advancedFilters,
});

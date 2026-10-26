import * as ActionTypes from "../constants";
import { trackFilterApply } from "../analytics";

export function addFilter(filter) {
  trackFilterApply(filter);
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
export const addAdvancedFilter = (filter) => {
  trackFilterApply(filter);
  return { type: ActionTypes.ADD_ADVANCED_FILTER, filter };
};
export const removeAdvancedFilter = (filter) => ({
  type: ActionTypes.REMOVE_ADVANCED_FILTER,
  filter,
});
export const setAdvancedFilters = (advancedFilters) => ({
  type: ActionTypes.SET_ADVANCED_FILTERS,
  advancedFilters,
});

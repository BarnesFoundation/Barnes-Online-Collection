import {
  ADD_FILTER,
  SET_FILTERS,
  REMOVE_FILTER,
  CLEAR_ALL_FILTERS,
  ADD_ADVANCED_FILTER,
  REMOVE_ADVANCED_FILTER,
  SET_ADVANCED_FILTERS,
  OBJECTS_QUERY_CURRENT_INDEX,
} from "../constants";

const filterActions = [
  ADD_FILTER,
  SET_FILTERS,
  REMOVE_FILTER,
  CLEAR_ALL_FILTERS,
  ADD_ADVANCED_FILTER,
  REMOVE_ADVANCED_FILTER,
  SET_ADVANCED_FILTERS,
];

/**
 * Middleware to reset stored index on any change to filters.
 */
export const resetIndex = (store) => (next) => (action) => {
  if (filterActions.includes(action.type)) {
    store.dispatch({ type: OBJECTS_QUERY_CURRENT_INDEX, currentIndex: 0 });
  }

  next(action);
};

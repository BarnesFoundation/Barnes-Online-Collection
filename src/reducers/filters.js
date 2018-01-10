import * as ActionTypes from '../constants';
import { selectRandomFilters, selectChosenFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  lines_composition: null,
  lines_linearity: null,
  light: null,
  space: null,
  ordered: [],
};

const removeFromOrderedSet = (orderedSet, filterType) => {
  return orderedSet.filter((filterEl) => {
    return filterEl.filterType !== filterType;
  });
}

const buildFilterStateObject = (orderedSet) => {
  // Refactored existing code into this function.
  // It's a little weird to have these initial null values,
  // but this is the form it wants to be in with the data passed to the 'ordered' property.
  return Object.assign({}, initialState, {
    ordered: orderedSet
  });
}

const filters = (state = initialState, action) => {
  const filterType = action.filter ? action.filter.filterType : null;

  switch(action.type) {
    case ActionTypes.ADD_FILTER:
      // Clone it
      let supplementedState = Object.assign({}, state);

      // first clean it up since there can be only one filter of each type now
      supplementedState.ordered = removeFromOrderedSet(state.ordered, filterType);
      // and add the new one to the ordered set
      supplementedState.ordered.push(action.filter);

      // the all types works differently -- it acts as a clear
      if (filterType === 'lines_linearity' && action.filter.name === 'all types') {
        supplementedState[filterType] = null;
      } else {
        supplementedState[filterType] = action.filter;
      }
      return supplementedState;
    case ActionTypes.REMOVE_FILTER:
      // clone it
      let reducedState = Object.assign({}, state);

      // and clean up the state
      reducedState.ordered = removeFromOrderedSet(state.ordered, filterType);
      reducedState[filterType] = null;

      return reducedState;
    case ActionTypes.CLEAR_ALL_FILTERS:
      return initialState;
    case ActionTypes.SHUFFLE_FILTERS:
      const randomFilters = selectRandomFilters();

      return buildFilterStateObject(randomFilters);
    case ActionTypes.SET_FILTERS:
      const filterSelection = action.filters || {};
      const selectedFilters = selectChosenFilters(filterSelection);

      return buildFilterStateObject(selectedFilters);
    default:
      return state;
  }
}

export default filters;

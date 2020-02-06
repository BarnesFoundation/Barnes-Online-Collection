import * as ActionTypes from '../constants';
import { selectRandomFilters, selectChosenFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  lines_composition: null,
  lines_linearity: null,
  light: null,
  space: null,
  advancedFilters: {
    cultures: {
      
    },
  },
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
    case ActionTypes.ADD_FILTER:{
      const supplementedState = Object.assign({}, state); // Deep copy state.

      // For unique, higher-level filters, remove any existing filter of same type and replace it with the new filter.
      supplementedState.ordered = [...removeFromOrderedSet(supplementedState.ordered, filterType), action.filter];

      // the all types works differently -- it acts as a clear
      supplementedState[filterType] = !(filterType === 'lines_linearity' && action.filter.name === 'all types')
        ? action.filter
        : null;
      
      return supplementedState;
    }
    case ActionTypes.REMOVE_FILTER:
      // const reducedState = Object.assign({}, state); // Deep copy state.

      // // and clean up the state
      // reducedState.ordered = ;
      // reducedState[filterType] = null;

      return { ...state, ordered: removeFromOrderedSet(state.ordered, filterType), [filterType]: null };
    case ActionTypes.CLEAR_ALL_FILTERS: return initialState;
    case ActionTypes.SHUFFLE_FILTERS: return buildFilterStateObject(selectRandomFilters());
    case ActionTypes.SET_FILTERS:
      const selectedFilters = selectChosenFilters(action.filters || {});
      return buildFilterStateObject(selectedFilters);
    case ActionTypes.ADD_ADVANCED_FILTER: {

    }
    default:
      return state;
  }
}

export default filters;

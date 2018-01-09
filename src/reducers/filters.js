import * as ActionTypes from '../constants';
import { selectRandomFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  line_composition: null,
  line_linearity: null,
  light: null,
  space: null,
  ordered: [],
};

const removeFromOrderedSet = (orderedSet, filterType) => {
  return orderedSet.filter((filterEl) => {
    return filterEl.filterType !== filterType;
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
      if (filterType === 'line_linearity' && action.filter.name === 'all types') {
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
      const filters = selectRandomFilters();
      let shuffledState = Object.assign({}, initialState, {
        ordered: filters
      });

      return shuffledState;
    default:
      return state;
  }
}

export default filters;

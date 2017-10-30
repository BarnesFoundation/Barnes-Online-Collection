import * as ActionTypes from '../constants';
import { selectRandomFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  lineComposition: null,
  lineLinearity: null,
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
      // clean the set
      state.ordered = removeFromOrderedSet(state.ordered, filterType);

      // add the new one to the ordered set
      let supplementedState = Object.assign({}, state, {
        ordered: [...state.ordered, action.filter]
      });

      // the all types works differently -- it acts as a clear
      if (filterType === 'lineLinearity' && action.filter.name === 'all types') {
        supplementedState[filterType] = null;
      } else {
        supplementedState[filterType] = action.filter;
      }

      return supplementedState;
    case ActionTypes.REMOVE_FILTER:
      state.ordered = removeFromOrderedSet(state.ordered, filterType);

      let reducedState = Object.assign({}, state, {
        ordered: state.ordered
      });

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

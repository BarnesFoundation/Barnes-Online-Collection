import * as ActionTypes from '../constants';
import { selectRandomFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  line: {
    composition: null,
    linearity: null,
  },
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

      // temp exception
      if (filterType === 'line') {
        supplementedState = addLineFilter(supplementedState, action.filter);
      } else {
        supplementedState[filterType] = action.filter;
      }

      return supplementedState;
    case ActionTypes.REMOVE_FILTER:
      state.ordered = removeFromOrderedSet(state.ordered, filterType);

      let reducedState = Object.assign({}, state, {
        ordered: state.ordered
      });

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

const addLineFilter = (state, filter) => {
  state.line = state.line || {
    composition: null,
    linearity: null
  };

  state.line[filter.filterGroup] = filter;

  // todo - try to remove special cases
  if (filter.filterGroup === 'linearity' && filter.name === 'all types') {
    state.line.linearity = null;
  }

  return state;
}

export default filters;

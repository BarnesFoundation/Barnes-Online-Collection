import * as ActionTypes from '../constants';
import { selectRandomFilters } from '../reducers/filterSets';

const initialState = {
  colors: [],
  line: {
    composition: null,
    linearity: null
  },
  light: null,
  space: null,
  ordered: []
};

const filters = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.ADD_FILTER:
      let supplementedState = Object.assign({}, state, {
        ordered: [...state.ordered, action.filter]
      });

      switch (action.filter.filterType) {
        case 'color':
          supplementedState.colors = [...state.colors, action.filter];
          break;
        case 'line':
          supplementedState = addLineFilter(supplementedState, action.filter);
          break;
        case 'light':
          if (state.light) {
            supplementedState.ordered = getReducedFilters(supplementedState.ordered, state.light.slug);
          }
          supplementedState.light = action.filter;
          break;
        case 'space':
          if (state.space) {
            supplementedState.ordered = getReducedFilters(supplementedState.ordered, state.space.slug);
          }
          supplementedState.space = action.filter;
          break;
        default:
          break;
      }
      supplementedState.ordered = [...new Set(supplementedState.ordered)];
      return supplementedState;
    case ActionTypes.REMOVE_FILTER:
      let reducedState = Object.assign({}, state, {
        ordered: getReducedFilters(state.ordered, action.filter.slug)
      });

      switch (action.filter.filterType) {
        case 'color':
          reducedState.colors = getReducedFilters(state.colors, action.filter.slug);
          break;
        case 'line':
          reducedState = removeLineFilter(state, reducedState, action.filter);
          break;
        case 'light':
          reducedState.light = null;
          break;
        case 'space':
          reducedState.space = null;
          break;
        default:
          break;
      }
      return reducedState;
    case ActionTypes.REMOVE_FILTER_BY_INDEX:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
    case ActionTypes.REMOVE_FILTER_BY_SLUG:
      const index = findIndexBySlug(state, action.slug);
      return [...state.slice(0, index), ...state.slice(index+1)];
    case ActionTypes.CLEAR_ALL_FILTERS:
      return initialState;
    case ActionTypes.SHUFFLE_FILTERS:
      const filters = selectRandomFilters();
      let shuffledState = Object.assign({}, initialState, {
        ordered: filters
      });

      filters.forEach((filter) => {
        switch (filter.filterType) {
          case 'color':
            shuffledState.colors.push(filter);
            break;
          case 'line':
            if (filter.filterGroup === 'composition') {
              shuffledState.line.composition = filter;
            } else if (filter.filterGroup === 'linearity') {
              filter.name === 'all types' ? shuffledState.line.linearity = null : shuffledState.line.linearity = filter;
            }
            break;
          case 'light':
            shuffledState.light = filter;
            break;
          case 'space':
            shuffledState.space = filter;
            break;
          default:
            break;
        }
      });
      return shuffledState;
    default:
      return state;
  }
}

const removeLineFilter = (state, reducedState, filter) => {
  if (filter.filterGroup === 'composition') {
    reducedState.line.composition = getReducedFilters(state.line.composition, filter.slug);
  } else if (filter.filterGroup === 'linearity') {
    if (!filter.name === 'all types') {
      reducedState.line.linearity = getReducedFilters(state.line.linearity, filter.slug);
    }
  }
  return reducedState;
}

const addLineFilter = (state, filter) => {
  state.line = state.line || {
    composition: null,
    linearity: null
  };

  if (filter.filterGroup === 'composition') {
    state.line.composition = state.line.composition ? [...state.line.composition, filter] : [filter];
  } else if (filter.filterGroup === 'linearity') {
    if (filter.name !== 'all types') {
      state.line.linearity = filter.name;
      state.ordered = getReducedFilters(state.ordered, 'line-all types');
      filter.name === 'broken' ? state.ordered = getReducedFilters(state.ordered, 'line-unbroken') : state.ordered = getReducedFilters(state.ordered, 'line-broken');
    } else {
      state.line.linearity = null;
      state.ordered = getReducedFilters(state.ordered, 'line-unbroken');
      state.ordered = getReducedFilters(state.ordered, 'line-broken');
    }
  }
  return state;
}

const getReducedFilters = (filters, slug) => {
  const index = findIndexBySlug(filters, slug);
  if (index > -1) {
    return [
      ...filters.slice(0, index),
      ...filters.slice(index + 1)
    ];
  } else {
    return filters;
  }
}

const findIndexBySlug = (filters, slug) => {
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].slug === slug) {
      return i;
    }
  }
  return -1;
}

export default filters;

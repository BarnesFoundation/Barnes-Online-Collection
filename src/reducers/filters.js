import * as ActionTypes from '../constants';

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
  const filter = action.filter;
  switch(action.type) {
    case ActionTypes.ADD_FILTER:
      let supplementedState = Object.assign({}, state, {
        ordered: [...state.ordered, filter]
      });

      switch (filter.filterType) {
        case 'color':
          supplementedState.colors = [...state.colors, filter];
          break;
        case 'line':
          supplementedState = addLineFilter(supplementedState, filter);
          break;
        case 'light':
          supplementedState.light = filter;
          break;
        case 'space':
          supplementedState.space = filter;
          break;
        default:
          break;
      }
      supplementedState.ordered = [...new Set(supplementedState.ordered)];
      return supplementedState;
    case ActionTypes.REMOVE_FILTER:
      let reducedState = Object.assign({}, state, {
        ordered: getReducedFilters(state.ordered, filter.slug)
      });

      switch (filter.filterType) {
        case 'color':
          reducedState.colors = getReducedFilters(state.colors, filter.slug);
          break;
        case 'line':
          reducedState = removeLineFilter(state, reducedState, filter);
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
      let newState = initialState;
      const lightFilter = {
        filterType: 'light',
        name: 'light',
        slug: 'light',
        svgId: 'tool_lights',
        value: Math.floor(Math.random() * 101)
      };
      const spaceFilter = {
        filterType: 'space',
        name: 'space',
        slug: 'space',
        svgId: 'tool_space',
        value: Math.floor(Math.random() * 101)
      };
      // let lineFilter = {
      //   filterType: 'line'
      // };
      // let colorFilter = {

      // }
      newState.ordered.push(lightFilter);
      newState.ordered.push(spaceFilter);
      newState.light = lightFilter;
      newState.space = spaceFilter;
      return newState;
    default:
      return state;
  }
}

function removeLineFilter(state, reducedState, filter) {
  if (filter.filterGroup === 'composition') {
    reducedState.line.composition = getReducedFilters(state.line.composition, filter.slug);
  } else if (filter.filterGroup === 'linearity') {
    if (!filter.name === 'all types') {
      reducedState.line.linearity = getReducedFilters(state.line.linearity, filter.slug);
    }
  }
  return reducedState;
}

function addLineFilter(state, filter) {
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

function getReducedFilters(filters, slug) {
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

function findIndexBySlug(filters, slug) {
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].slug === slug) {
      return i;
    }
  }
  return -1;
}

export default filters;

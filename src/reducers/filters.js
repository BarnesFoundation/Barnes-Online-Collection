import * as ActionTypes from '../constants';

const initialState = {
  colors: [],
  line: {
    composition: null,
    linearity: null
  },
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
          supplementedState.line = supplementedState.line || {
            composition: null,
            linearity: null
          };

          if (filter.filterGroup === 'composition') {
            if (supplementedState.line.composition) {
              supplementedState.line.composition = [...supplementedState.line.composition, filter];
            } else {
              supplementedState.line.composition = [filter];
            }
          } else if (filter.filterGroup === 'linearity') {
            if (filter.name !== 'all types') {
              supplementedState.line.linearity = filter.name;
              supplementedState.ordered = getReducedFilters(supplementedState.ordered, 'line-all types');
              if (filter.name === 'broken') {
                supplementedState.ordered = getReducedFilters(supplementedState.ordered, 'line-unbroken');
              } else if (filter.name === 'unbroken') {
                supplementedState.ordered = getReducedFilters(supplementedState.ordered, 'line-broken');
              }
            } else {
              supplementedState.line.linearity = null;
              let newOrdered = getReducedFilters(supplementedState.ordered, 'line-unbroken');
              supplementedState.ordered = getReducedFilters(newOrdered, 'line-broken');
            }
          }
          break;
        case 'light':
          debugger;
          break;
        case 'space':
          break;
        default:
          break;
      }
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
          if (filter.filterGroup === 'composition') {
            reducedState.line.composition = getReducedFilters(state.line.composition, filter.slug);
          } else if (filter.filterGroup === 'linearity') {
            if (!filter.name === 'all types') {
              reducedState.line.linearity = getReducedFilters(state.line.linearity, filter.slug);
            }
          }
          break;
        case 'light':
          debugger;
          break;
        case 'space':
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
    default:
      return state;
  }
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

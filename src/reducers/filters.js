import * as ActionTypes from '../constants';

const initialState = {
  colors: [],
  line: {
    composition: null,
    linearity: null
  },
  line: null,
  space: null,
  ordered: []
};

const lineFilterObject = {
  composition: null,
  linearity: null
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
          supplementedState.line = supplementedState.line || lineFilterObject;

          switch (action.filter.name) {
            case 'vertical':
            case 'diagonal':
            case 'horizontal':
            case 'curvy':
              if (supplementedState.line.composition) {
                supplementedState.line.composition = [...supplementedState.line.composition, action.filter]
              ;
              } else {
                supplementedState.line.composition = [action.filter];
              }
              break;
            case 'broken':
            case 'unbroken':
              supplementedState.line.linearity = action.filter.name;
              break;
            case 'all-types':
              supplementedState.line.linearity = null;
              break;
            default:
              break;
          }
        default:
          break;
      }
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
          switch(action.filter.name) {
            case 'vertical':
            case 'diagonal':
            case 'horizontal':
            case 'curvy':
              reducedState.line.composition = getReducedFilters(state.line.composition, action.filter.slug);
              break;
            case 'broken':
            case 'unbroken':
              reducedState.line.linearity = getReducedFilters(state.line.linearity, action.filter.slug);
              break;
            case 'all-types':
              break;
            default:
              break;
          }
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

function getReducedFilters(filterArray, slug) {
  const index = findIndexBySlug(filterArray, slug);
  return [
    ...filterArray.slice(0, index),
    ...filterArray.slice(index + 1)
  ];
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

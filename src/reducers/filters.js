import * as ActionTypes from '../constants';

const filters = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.ADD_TO_FILTERS:
      return [...state, action.filter];
    case ActionTypes.REMOVE_FILTER_BY_INDEX:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
    case ActionTypes.REMOVE_FILTER_BY_SLUG:
      const index = findIndexBySlug(state, action.slug);
      return [...state.slice(0, index), ...state.slice(index+1)];
    case ActionTypes.CLEAR_ALL_FILTERS:
      return [];
    default:
      return state;
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

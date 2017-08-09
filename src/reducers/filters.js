import * as ActionTypes from '../constants';

const initialState = {
  visibleFilterSet: null
};

const filters = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SELECT_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: action.slug });
    default:
      return state;
  }
}

export default filters;

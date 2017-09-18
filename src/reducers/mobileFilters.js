import * as ActionTypes from '../constants';

const initialState = {
  visible: false
};

const mobileFilters = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.OPEN_MOBILE_FILTERS:
      return Object.assign({}, state, { visible: true });
    case ActionTypes.CLOSE_MOBILE_FILTERS:
      return Object.assign({}, state, { visible: false });
    default:
      return state;
  }
}

export default mobileFilters;

import * as ActionTypes from '../constants';

const initialState = {
  visible: false
};

const mobileFilters = (state = initialState, action) => {
  const isVisible = state.visible;

  switch(action.type) {
    case ActionTypes.TOGGLE_MOBILE_FILTERS:
      return Object.assign({}, state, { visible: !isVisible });
    default:
      return state;
  }
}

export default mobileFilters;

import * as ActionTypes from "../constants";

const initialState = {
  visible: false,
  filtersPending: false,
  filtersApplied: false,
};

const mobileFilters = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_MOBILE_FILTERS:
      return Object.assign({}, state, { visible: true });
    case ActionTypes.CLOSE_MOBILE_FILTERS:
      return Object.assign({}, state, { visible: false });
    case ActionTypes.QUEUE_MOBILE_FILTERS:
      return Object.assign({}, state, { filtersPending: true });
    case ActionTypes.APPLY_MOBILE_FILTERS:
      return Object.assign({}, state, {
        filtersApplied: true,
      });
    case ActionTypes.RESET_MOBILE_FILTERS:
      return Object.assign({}, state, {
        filtersPending: false,
        filtersApplied: false,
      });
    default:
      return state;
  }
};

export default mobileFilters;

import * as ActionTypes from '../constants';

export function openMobileFilters() {
  return {
    type: ActionTypes.OPEN_MOBILE_FILTERS
  }
}

export function closeMobileFilters() {
  return {
    type: ActionTypes.CLOSE_MOBILE_FILTERS
  }
}

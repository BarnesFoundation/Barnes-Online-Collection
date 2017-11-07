import * as ActionTypes from '../constants';

export function openMobileSearch() {
  return {
    type: ActionTypes.OPEN_MOBILE_SEARCH
  }
}

export function closeMobileSearch() {
  return {
    type: ActionTypes.CLOSE_MOBILE_SEARCH
  }
}

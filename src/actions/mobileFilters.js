import * as ActionTypes from '../constants'

export function openMobileFilters () {
  return {
    type: ActionTypes.OPEN_MOBILE_FILTERS
  }
}

export function closeMobileFilters () {
  return {
    type: ActionTypes.CLOSE_MOBILE_FILTERS
  }
}

export function queueMobileFilters (filters) {
  return {
    type: ActionTypes.QUEUE_MOBILE_FILTERS,
    filters: filters
  }
}

export function applyMobileFilters (filters) {
  return {
    type: ActionTypes.APPLY_MOBILE_FILTERS,
    filters: filters
  }
}

export function resetMobileFilters () {
  return {
    type: ActionTypes.RESET_MOBILE_FILTERS
  }
}

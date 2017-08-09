import * as ActionTypes from '../constants';

export function htmlClassesAdd(className) {
  return {
    type: ActionTypes.HTML_CLASSES_ADD,
    payload: className
  }
}

export function htmlClassesRemove(className) {
  return {
    type: ActionTypes.HTML_CLASSES_REMOVE,
    payload: className
  }
}

export function htmlClassesToggle(className) {
  return {
    type: ActionTypes.HTML_CLASSES_TOGGLE,
    payload: className
  }
}

export function htmlClassesReset(className) {
  return {
    type: ActionTypes.HTML_CLASSES_RESET,
  }
}

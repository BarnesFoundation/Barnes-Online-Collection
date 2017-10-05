import * as ActionTypes from '../constants';

export const modalShow = () => {
  return {
    type: ActionTypes.MODAL_SHOW
  };
}

export const modalHide = () => {
  return {
    type: ActionTypes.MODAL_HIDE
  };
}

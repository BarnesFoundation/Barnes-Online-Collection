import * as ActionTypes from '../constants';

const initialState = {
  modalIsOpen: false
};

const modal = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.MODAL_SHOW:
      return Object.assign({}, state, { modalIsOpen: true });
    case ActionTypes.MODAL_HIDE:
      return Object.assign({}, state, { modalIsOpen: false });
    default:
      return state;
  }
};

export default modal;

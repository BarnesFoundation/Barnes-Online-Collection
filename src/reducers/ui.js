import * as ActionTypes from '../constants';

const initialState = {
  modalIsOpen: false
};

const ui = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.MODAL_SHOW:
      return Object.assign({}, state, { modalIsOpen: true });
    case ActionTypes.MODAL_HIDE:
      return Object.assign({}, state, { modalIsOpen: false });
    case ActionTypes.RESET_UI:
      return initialState;
    default:
      return state;
  }
};

export default ui;

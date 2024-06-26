import * as ActionTypes from "../constants";

const initialState = {
  modalIsOpen: false,
  modalParentState: {},
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.MODAL_SHOW:
      return Object.assign({}, state, { modalIsOpen: true });
    case ActionTypes.MODAL_HIDE:
      return Object.assign({}, state, { modalIsOpen: false });
    case ActionTypes.MODAL_SET_PARENT_STATE:
      return Object.assign({}, state, { modalParentState: action.state });
    default:
      return state;
  }
};

export default modal;

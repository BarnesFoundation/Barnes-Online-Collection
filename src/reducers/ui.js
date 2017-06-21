import * as ActionTypes from '../constants';

const initialState = {
  zoomOverlayVisible: false
};

const ui = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SHOW_ZOOM_OVERLAY:
      return Object.assign({}, state, { zoomOverlayVisible: true });
    case ActionTypes.HIDE_ZOOM_OVERLAY:
      return Object.assign({}, state, { zoomOverlayVisible: false });
    case ActionTypes.RESET_UI:
      return initialState;
    default:
      return state;
  }
};

export default ui;

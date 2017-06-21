import * as ActionTypes from '../constants';

export const showZoomOverlay = () => {
  console.log('calling show zoom overlay');
  return {
    type: ActionTypes.SHOW_ZOOM_OVERLAY
  };
}

export const hideZoomOverlay = () => {
  return {
    type: ActionTypes.HIDE_ZOOM_OVERLAY
  };
}

export const resetUI = () => {
  return {
    type: ActionTypes.RESET_UI
  };
}

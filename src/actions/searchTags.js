import * as ActionTypes from '../constants';

export const removeSearchTag = (tag) => {
  return {
    type: ActionTypes.REMOVE_SEARCHTAG,
    payload: tag
  }
}

export const resetSearchTags = () => {
  return {
    type: ActionTypes.RESET_SEARCHTAGS
  };
}
import * as ActionTypes from '../constants';

export function routerSearchInit(bool) {
  return {
    type: ActionTypes.ROUTER_SEARCH_INIT,
    bool: bool
  }
}
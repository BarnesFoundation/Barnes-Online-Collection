import * as ActionTypes from '../constants';

const initialState = {
  isPending: null,
};

const ensembleObjectsQuery = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.ENSEMBLE_OBJECTS_QUERY_SET_IS_PENDING:
      return Object.assign({}, state, {
        isPending: action.isPending
      });
    default:
      return state;
  }
}

export default ensembleObjectsQuery;

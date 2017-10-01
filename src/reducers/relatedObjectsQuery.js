import * as ActionTypes from '../constants';

const initialState = {
  isPending: true,
};

const relatedObjectsQuery = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.RELATED_OBJECTS_QUERY_SET_IS_PENDING:
      return Object.assign({}, state, {
        isPending: action.isPending
      });
    default:
      return state;
  }
}

export default relatedObjectsQuery;

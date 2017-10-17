import * as ActionTypes from '../constants'

const initialState = {
  hasMoreResults: null,
  lastIndex: null,
  isPending: null
}

const objectsQuery = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OBJECTS_QUERY_SET_HAS_MORE_RESULTS:
      return Object.assign({}, state, {
        hasMoreResults: action.hasMoreResults
      })
    case ActionTypes.OBJECTS_QUERY_SET_LAST_INDEX:
      return Object.assign({}, state, {
        lastIndex: action.lastIndex
      })
    case ActionTypes.OBJECTS_QUERY_SET_IS_PENDING:
      return Object.assign({}, state, {
        isPending: action.isPending
      })
    default:
      return state
  }
}

export default objectsQuery

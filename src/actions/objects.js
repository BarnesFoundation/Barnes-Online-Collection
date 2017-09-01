import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const buildRequestBody = (fromIndex=0) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(25);
  return body;
}

const fetchResults = (body, dispatch, append=false) => {
  axios.get('/api/search', {
    params: {
      body: body,
    }
  }).then((response) => {
    const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));

    dispatch(setMaxHits(response.data.hits.total));
    dispatch(setLastIndex(body.from + body.size));

    if (append) {
      dispatch(appendObjects(objects));
    } else {
      dispatch(setObjects(objects));
    }
  });
}

const setObjects = (objects) => {
  return {
    type: ActionTypes.SET_OBJECTS,
    payload: objects
  };
}

const appendObjects = (objects) => {
  return {
    type: ActionTypes.APPEND_OBJECTS,
    payload: objects
  };
}

const setMaxHits = (maxHits) => {
  return {
    type: ActionTypes.SET_MAX_HITS,
    maxHits: maxHits
  };
}

const setLastIndex = (lastIndex) => {
  return {
    type: ActionTypes.SET_LAST_INDEX,
    lastIndex: lastIndex
  };
}

export const getNextObjects = (fromIndex, query=null) => {
  return (dispatch) => {
    const append = true;
    if (!query) {
      return getAllObjects(fromIndex, append)(dispatch);
    } else if (typeof query === 'string') {
      return searchObjects(query, fromIndex, append)(dispatch);
    } else if (typeof query === 'object') {
      return findFilteredObjects(query, fromIndex, append)(dispatch);
    }
  }
}

export const getAllObjects = (fromIndex=0, append=false) => {
  const body = buildRequestBody(fromIndex).build();
  return (dispatch) => {
    fetchResults(body, dispatch, append);
  }
};

export const findFilteredObjects = (filters, fromIndex=0, append=false) => {
  return (dispatch) => {
    if (!filters.ordered || filters.ordered.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = buildRequestBody(fromIndex);
    let queries = [];

    for (let i = 0; i < filters.ordered.length; i++) {
      const filter = filters.ordered[i];
      switch (filter.filterType) {
        case 'color':
          for (let i = 0; i < filter.queries.length; i++) {
            queries.push(buildColorQuery(filter.queries[i]));
          }
          break;
        default:
          break;
      }
    }
    body = assembleDisMaxQuery(body, queries);
    body = body.build();
    fetchResults(body, dispatch, append);
  }
}

const buildSingleColorQuery = (body, query) => {
  return body.query('multi_match', {
    query: query,
    fields: [
      'color.palette-closest-*',
      'color.palette-color-*',
      'color.average-closest',
      'color.average-color'
    ]
  });
}

const buildColorQuery = (query) => {
  return {
    'multi_match': {
      query: query,
      fields: [
        'color.palette-closest-*',
        'color.palette-color-*',
        'color.average-closest',
        'color.average-color'
      ]
    }
  };
}

const assembleDisMaxQuery = (body, queries) => {
  return body.query('dis_max', {
    'queries': queries
  });
}

export const searchObjects = (term, fromIndex=0, append=false) => {
  return (dispatch) => {
    if (term.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = buildRequestBody(fromIndex);
    body = body.query('match', '_all', term);
    body = body.build();

    fetchResults(body, dispatch, append);
  }
}

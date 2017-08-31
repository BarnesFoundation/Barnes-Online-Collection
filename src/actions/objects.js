import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const buildRequestBody = (idxFrom=0, size=25) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(idxFrom).size(size);

  return body;
}

const fetchResults = (body, dispatch) => {
  axios.get('/api/search', {
    params: {
      body: body,
    }
  }).then((response) => {
    console.log(body);
    console.log(response.data.hits.hits.length, 'hits');
    const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));

    dispatch(setObjects(objects));
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

export const getAllObjects = () => {
  const body = buildRequestBody().build();
  return (dispatch) => {
    fetchResults(body, dispatch);
  }
};

export const findFilteredObjects = (filters) => {
  return (dispatch) => {
    if (!filters.ordered || filters.ordered.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = buildRequestBody();
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
    fetchResults(body, dispatch);
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

export const searchObjects = (term) => {
  return (dispatch) => {
    if (term.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = buildRequestBody();
    body = body.query('match', '_all', term);
    body = body.build();

    fetchResults(body, dispatch);
  }
}

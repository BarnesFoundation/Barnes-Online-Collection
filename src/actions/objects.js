import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const buildRequestBody = () => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25);

  return body;
}

const setObjects = (objects) => {
  return {
    type: ActionTypes.SET_OBJECTS,
    payload: objects
  };
}

export const getObjects = () => {
  let body = buildRequestBody().build();

  return (dispatch) => {
    axios.get('/api/search', {
      params: {
        body: body,
      }
    }).then((response) => {
      const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
      dispatch(setObjects(objects));
    });
  }
};

export const findObjectsByKeyword = (query) => {
  return (dispatch) => {
    if (query === '') {
      return getObjects()(dispatch);
    }

    let body = buildRequestBody();
    body = body.query('match', '_all', query).build();

    axios.get('/api/search', {
      params: {
        body: body,
      }
    }).then((response) => {
      const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
      dispatch(setObjects(objects));
    });
  }
}

export const findFilteredObjects = (queries, filters) => {
  return (dispatch) => {
    const filtersApplied = filters.filtersApplied;
    if (queries === '' && filtersApplied.length === 0) {
      return getObjects()(dispatch);
    }

    let body = buildRequestBody();
    for (let i = 0; i < queries.length; i++) {
      body = body.query(queries[i][0], queries[i][1], queries[i][2]);
    }
    for (let i = 0; i < filtersApplied.length; i++) {
      const filter = filtersApplied[i];
      body = body.query(filter[0], filter[1], filter[2]);
    }
    body = body.build();

    axios.get('/api/search', {
      params: {
        body: body,
      }
    }).then((response) => {
      console.log(response.data);
      const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
      dispatch(setObjects(objects));
    });
  }
}

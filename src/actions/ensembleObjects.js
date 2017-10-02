import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';
import { BARNES_SETTINGS } from '../barnesSettings';
import { DEV_LOG } from '../devLogging';

const uniqBy = require('lodash/uniqBy');

const buildRequestBody = (fromIndex=0) => {
  let body = bodybuilder()
    .sort('_score', 'desc')
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(BARNES_SETTINGS.size);
  return body;
}

// todo: refactor to consolidate these helper functions
const mapObjects = (objects) => {
  let mappedObjects = uniqBy(objects, '_id');
  const dedupedObjectLen = objects.length - mappedObjects.length;

  if(dedupedObjectLen > 0) {
    DEV_LOG(`Note: ${dedupedObjectLen} objects were duplicates and removed from the results.`);
  }

  return mappedObjects.map(object => Object.assign({}, object._source, { id: object._id }));
}

const fetchResults = (body, dispatch) => {
  DEV_LOG('Fetching Ensemble Objects results...');

  dispatch(setIsPending(true));

  axios.get('/api/search', { params: { body: body } })
  .then((response) => {
    let objects = [];

    if (response.data.hits) {
      objects = mapObjects(response.data.hits.hits);
    }

    DEV_LOG('Retrieved '+objects.length+' objects.' );

    dispatch(setIsPending(false));
    dispatch(setEnsembleObjects(objects));
  });
}

const setIsPending = (isPending) => {
  return {
    type: ActionTypes.ENSEMBLE_OBJECTS_QUERY_SET_IS_PENDING,
    isPending: isPending
  };
}

const setEnsembleObjects = (objects) => {
  DEV_LOG('Setting Ensemble objects...');

  return {
    type: ActionTypes.SET_ENSEMBLE_OBJECTS,
    payload: objects
  };
}

export const getEnsembleObjects = (ensembleIndex) => {
  let body = buildRequestBody(0, 125);
  body = body.query('match', 'ensembleIndex', ensembleIndex);
  body = body.build();

  return (dispatch) => {
    fetchResults(body, dispatch);
  }
}

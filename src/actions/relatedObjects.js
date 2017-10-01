import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';
import { BARNES_SETTINGS, MORE_LIKE_THIS_FIELDS } from '../barnesSettings';
import { DEV_LOG } from '../devLogging';

const uniqBy = require('lodash/uniqBy');

const buildRequestBody = (fromIndex=0) => {
  let body = bodybuilder()
    .sort('_score', 'desc')
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(BARNES_SETTINGS.size);
  return body;
}

const mapObjects = (objects) => {
  let mappedObjects = uniqBy(objects, '_id');
  const dedupedObjectLen = objects.length - mappedObjects.length;

  if(dedupedObjectLen > 0) {
    DEV_LOG(`Note: ${dedupedObjectLen} objects were duplicates and removed from the results.`);
  }

  return mappedObjects.map(object => Object.assign({}, object._source, { id: object._id }));
}

const fetchResults = (body, dispatch) => {
  DEV_LOG('Fetching related Objects results...');

  dispatch(setIsPending(true));
  // debugger;
  // todo: test this
  // dispatch(clearRelatedObjects());

  axios.get('/api/search', { params: { body: body } })
  .then((response) => {
    let objects = [];

    if (response.data.hits) {
      objects = mapObjects(response.data.hits.hits);
    }

    DEV_LOG('Retrieved '+objects.length+' objects.' );

    dispatch(setIsPending(false));
    dispatch(setRelatedObjects(objects));
  });
}

const setIsPending = (isPending) => {
  return {
    type: ActionTypes.RELATED_OBJECTS_QUERY_SET_IS_PENDING,
    isPending: isPending
  };
}

const setRelatedObjects = (objects) => {
  DEV_LOG('Setting related objects...');

  return {
    type: ActionTypes.SET_RELATED_OBJECTS,
    payload: objects
  };
}

const clearRelatedObjects = () => {
  return {
    type: ActionTypes.CLEAR_RELATED_OBJECTS,
  };
}

export const getRelatedObjects = (objectID, value=50, fromIndex=0) => {
  const minShouldMatch = 100 - value;

  let body = buildRequestBody(fromIndex, 25);
  body = body.query('more_like_this', {
    'like': [
      {
        '_index': process.env.ELASTICSEARCH_INDEX,
        '_type': 'object',
        '_id': objectID
      }
    ],
    'fields': MORE_LIKE_THIS_FIELDS,
    'min_term_freq': 1,
    'minimum_should_match': `${minShouldMatch}%`
  });
  body = body.build();

  return (dispatch) => {
    fetchResults(body, dispatch);
  }
}

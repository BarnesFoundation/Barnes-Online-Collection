import axios from 'axios';
import { getObjectsRequestBody } from '../helpers';
import * as ActionTypes from '../constants';
import { BARNES_SETTINGS, SEARCH_FIELDS } from '../barnesSettings';
import { DEV_LOG } from '../devLogging';

const uniqBy = require('lodash/uniqBy');

const addHighlightsFilter = (body) => {
  return body.filter('match', 'highlight', 'true');
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

const fetchResults = (body, dispatch, options={}) => {
  DEV_LOG('Fetching results...');

  dispatch(setIsPending(true));

  axios.get('/api/search', { params: { body: body } })
  .then((response) => {
    let objects = [];
    let maxHits = 0;
    // Note: confirm that we don't need this 25 default. The front end logic was using it before
    // let lastIndex = (body.from + body.size) || 25;
    let lastIndex = body.from + body.size;
    let hasMoreResults = false;

    if (response.data.hits) {
      objects = mapObjects(response.data.hits.hits);
      maxHits = response.data.hits.total;
      hasMoreResults = maxHits > lastIndex;
    }

    DEV_LOG('Retrieved '+objects.length+' objects.' );

    dispatch(setLastIndex(lastIndex));
    dispatch(setHasMoreResults(hasMoreResults));

    if (options.barnesify && (maxHits >= BARNES_SETTINGS.size)) {
        barnesifyObjects(objects, dispatch, options).then(() => {
          // note, dispatch(setObjects(barnesifiedObjects)) is called from within barnesifyObjects
          dispatch(setIsPending(false));
        });
    } else {
      options.append ? dispatch(appendObjects(objects)) : dispatch(setObjects(objects));
      dispatch(setIsPending(false));
      dispatch(resetMobileFilters());
    }
  });
}

const resetMobileFilters = () => {
  return {
    type: ActionTypes.RESET_MOBILE_FILTERS,
  };
}

const shuffleObjects = (objects) => {
  let i = 0;
  let j = 0;
  let temp = null;

  for (i = objects.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = objects[i];
    objects[i] = objects[j];
    objects[j] = temp;
  }

  return objects;
}

const barnesifyObjects = (objects, dispatch, options) => {
  DEV_LOG('Beginning Barnesification process...');

  let barnesObjects = BARNES_SETTINGS.objectsTemplate;

  const updateBarnesObjects = (objects, type) => {
    barnesObjects[type].push(...objects);
  }

  const getBarnsifiedObjects = () => {
    DEV_LOG('Compiling Barnesified object set...');

    let ratios = {
      '2D': 0,
      metalworks: 0,
      '3D': 0,
      knickknacks: 0,
      total: 0
    };

    let refinedBarnesObjects = barnesObjects.twoD.slice(0, BARNES_SETTINGS.min2D);
    ratios['2D'] = refinedBarnesObjects.length;

    let metalworks = barnesObjects.metalworks.slice(0, BARNES_SETTINGS.minMetalworks);
    refinedBarnesObjects.push(...metalworks);
    ratios['metalworks'] = metalworks.length;

    let metalworksDiff = BARNES_SETTINGS.minMetalworks - metalworks.length;

    let threeD = barnesObjects.threeD.slice(0, (BARNES_SETTINGS.min3D + metalworksDiff));
    refinedBarnesObjects.push(...threeD);
    ratios['3D'] = threeD.length;

    let knickknacks = barnesObjects.knickknacks.slice(0, (BARNES_SETTINGS.size - refinedBarnesObjects.length));
    refinedBarnesObjects.push(...knickknacks);
    ratios['knickknacks'] = knickknacks.length;

    ratios['total'] = refinedBarnesObjects.length;

    // TODO: @rachel, mapObjects now dedupes objects, so let's consider whether
    // we need to calc these ratios above after the deduping?
    let mappedObjects = mapObjects(shuffleObjects(refinedBarnesObjects));

    DEV_LOG('Total objects: '+ratios.total);
    DEV_LOG('2D: '+ratios['2D']+' objects / '+ratios['2D']/ratios.total);
    DEV_LOG('metalworks: '+ratios['metalworks']+' objects / '+ratios['metalworks']/ratios.total);
    DEV_LOG('3D: '+ratios['3D']+' objects / '+ratios['3D']/ratios.total);
    DEV_LOG('Knick Knacks: '+ratios['knickknacks']+' objects / '+ratios['knickknacks']/ratios.total);

    return mappedObjects;
  }

  const params = (terms) => {
    let body = getObjectsRequestBody().query('terms', 'classification', terms);

    if (options.highlights) body = addHighlightsFilter(body);
    if (options.queries) body = assembleDisMaxQuery(body, options.queries);

    body = body.build();

    return { params: { body: body } };
  }

  const checkBarnesificationPossible = () => {
    if (barnesObjects.twoD.length >= BARNES_SETTINGS.min2D) {
      if (barnesObjects.metalworks.length >= BARNES_SETTINGS.minMetalworks) {
        if (barnesObjects.threeD.length >= BARNES_SETTINGS.min3D) {
          return true;
        } else {
          return (barnesObjects.threeD.length + barnesObjects.knickknacks.length) >= (BARNES_SETTINGS.min3D + BARNES_SETTINGS.minKnickKnacks);
        }
      } else {
        return (barnesObjects.threeD.length + barnesObjects.metalworks.length) >= (BARNES_SETTINGS.min3D + BARNES_SETTINGS.minMetalworks);
      }
    } else {
      return false;
    }
  }

  const get2DObjects = () => {
    return axios.get('/api/search', params(BARNES_SETTINGS.terms2D));
  }

  const getMetalworks = () => {
    return axios.get('/api/search', params(BARNES_SETTINGS.termsMetalworks));
  }

  const get3DObjects = () => {
    return axios.get('/api/search', params(BARNES_SETTINGS.terms3D));
  }

  const getKnickKnacks = () => {
    return axios.get('/api/search', params(BARNES_SETTINGS.termsKnickKnacks));
  }

  return axios.all([
    get2DObjects(),
    getMetalworks(),
    get3DObjects(),
    getKnickKnacks()
  ]).then(axios.spread((twoD, metalworks, threeD, knickknacks) => {
    let retObjects = objects;

    updateBarnesObjects(twoD.data.hits.hits, 'twoD');
    updateBarnesObjects(metalworks.data.hits.hits, 'metalworks');
    updateBarnesObjects(threeD.data.hits.hits, 'threeD');
    updateBarnesObjects(knickknacks.data.hits.hits, 'knickknacks');

    DEV_LOG('Retrieved '+twoD.data.hits.total+' 2D objects.');
    DEV_LOG('Retrieved '+metalworks.data.hits.total+' metalworks.');
    DEV_LOG('Retrieved '+threeD.data.hits.total+' 3D objects.');
    DEV_LOG('Retrieved '+knickknacks.data.hits.total+' knickknacks.');

    if (checkBarnesificationPossible()) {
      retObjects = getBarnsifiedObjects();
    }

    dispatch(setObjects(retObjects));
  }));
}

const setObjects = (objects) => {
  DEV_LOG('Setting objects...');
  return {
    type: ActionTypes.SET_OBJECTS,
    payload: objects
  };
}

const appendObjects = (objects) => {
  DEV_LOG('Appending objects...');
  return {
    type: ActionTypes.APPEND_OBJECTS,
    payload: objects
  };
}

const setHasMoreResults = (hasMoreResults) => {
  return {
    type: ActionTypes.OBJECTS_QUERY_SET_HAS_MORE_RESULTS,
    hasMoreResults: hasMoreResults
  };
}

const setIsPending = (isPending) => {
  return {
    type: ActionTypes.OBJECTS_QUERY_SET_IS_PENDING,
    isPending: isPending
  };
}

const setLastIndex = (lastIndex) => {
  return {
    type: ActionTypes.OBJECTS_QUERY_SET_LAST_INDEX,
    lastIndex: lastIndex
  };
}

export const getNextObjects = (fromIndex, query=null) => {
  return (dispatch) => {
    if (!query) {
      return getAllObjects(fromIndex)(dispatch);
    } else if (typeof query === 'string') {
      return searchObjects(query, fromIndex)(dispatch);
    } else if (typeof query === 'object') {
      return findFilteredObjects(query, fromIndex)(dispatch);
    }
  }
}

export const getAllObjects = (fromIndex=0) => {
  let body = getObjectsRequestBody(fromIndex);
  let options = {};

  if (!fromIndex) {
    body = addHighlightsFilter(body);
    options.barnesify = true;
    options.highlights = true;
  } else {
    options.append = true;
    options.barnesify = false;
  }

  body = body.build();

  return (dispatch) => {
    fetchResults(body, dispatch, options);
  }
};

export const findFilteredObjects = (filters, fromIndex=0) => {
  if (
    !filters.ordered ||
    filters.ordered.length === 0 ||
    (filters.ordered.length === 1 && filters.ordered[0].name === 'all types')
    ) {
    return (dispatch) => { getAllObjects()(dispatch); }
  }

  const queries = buildQueriesFromFilters(filters.ordered);

  const options = {
    queries: queries,
    barnesify: !fromIndex,
    append: !!fromIndex
  };

  let body = getObjectsRequestBody(fromIndex);
  body = assembleDisMaxQuery(body, queries);
  body = body.build();


  return (dispatch) => {
    fetchResults(body, dispatch, options);
  }
}

const buildQueriesFromFilters = (filters) => {
  let queries = [];

  filters.forEach((filter) => {
    switch (filter.filterType) {
      case 'colors':
        filter.queries.forEach((query) => {
          queries.push(buildColorQuery(query));
        })
        break;
      case 'lines_composition':
        queries.push(buildRangeQuery(filter.name, { 'gte': BARNES_SETTINGS.line_threshhold }));
        break;
      case 'lines_linearity':
        switch (filter.name) {
          case 'unbroken':
            queries.push(buildRangeQuery('line', { 'lte': BARNES_SETTINGS.broken_threshhold }));
            break;
          case 'broken':
            queries.push(buildRangeQuery('line', { 'gte': BARNES_SETTINGS.broken_threshhold }));
            break;
          case 'all types':
            break;
          default:
            throw new Error('unexpected filterType');
        }

        break;
      case 'light':
        queries.push(buildRangeQuery(filter.name, { 'lte': ((filter.value/100) + .01) }));
        break;
      case 'space':
        queries.push(buildRangeQuery(filter.name, { 'lte': ((filter.value/100) + .01) }));
        break;
      default:
        break;
    }
  });

  return queries;
}

const buildColorQuery = (query) => {
  return {
    'multi_match': {
      query: query,
      fields: [
        'color.palette-*',
        'color.average-*',
      ]
    }
  };
}

const buildRangeQuery = (field, query) => {
  let queryObject = { range: {} };
  queryObject['range'][field] = query;
  return queryObject;
}

const assembleDisMaxQuery = (body, queries) => {
  return body.query('dis_max', {
    'queries': queries,
    'tie_breaker': 5
  });
}

export const searchObjects = (term, fromIndex=0) => {
  return (dispatch) => {
    let options = {};

    if (term.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = getObjectsRequestBody(fromIndex).build();

    const query = {
      'query': term,
      'fields': SEARCH_FIELDS
    };

    body.query.bool['must'] = {
      'multi_match': query
    };

    DEV_LOG(body);

    if (fromIndex >= 50) options.append = true;

    fetchResults(body, dispatch, options);
  }
}

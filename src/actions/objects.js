import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';
import { BARNES_SETTINGS } from '../barnesSettings';
import { DEV_LOG } from '../devLogging';

const buildRequestBody = (fromIndex=0) => {
  let body = bodybuilder()
    .sort('_score', 'desc')
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(BARNES_SETTINGS.size);
  return body;
}

const addHighlightsFilter = (body) => {
  return body.filter('match', 'highlight', 'true');
}

const mapObjects = (objects) => {
  return objects.map(object => Object.assign({}, object._source, { id: object._id }));
}

const fetchResults = (body, dispatch, options={}) => {
  DEV_LOG('Fetching results...');

  dispatch(setIsPending(true));

  axios.get('/api/search', { params: { body: body } })
  .then((response) => {
    let objects = [];
    let maxHits = 0;
    const lastIndex = body.from + body.size;

    if (response.data.hits) {
      objects = mapObjects(response.data.hits.hits);
      maxHits = response.data.hits.total;
    }

    DEV_LOG('Retrieved '+objects.length+' objects.' );

    dispatch(setMaxHits(maxHits));
    dispatch(setLastIndex(lastIndex));

    if (options.barnesify && (maxHits >= BARNES_SETTINGS.size)) {
        barnesifyObjects(objects, dispatch, options);
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

  const setBarnesObjects = () => {
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

    let objects = mapObjects(shuffleObjects(refinedBarnesObjects));

    DEV_LOG('Total objects: '+ratios.total);
    DEV_LOG('2D: '+ratios['2D']+' objects / '+ratios['2D']/ratios.total);
    DEV_LOG('metalworks: '+ratios['metalworks']+' objects / '+ratios['metalworks']/ratios.total);
    DEV_LOG('3D: '+ratios['3D']+' objects / '+ratios['3D']/ratios.total);
    DEV_LOG('Knick Knacks: '+ratios['knickknacks']+' objects / '+ratios['knickknacks']/ratios.total);

    dispatch(setObjects(objects));
  }

  const params = (terms) => {
    let body = buildRequestBody().query('terms', 'classification', terms);

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

  axios.all([
    get2DObjects(),
    getMetalworks(),
    get3DObjects(),
    getKnickKnacks()
  ]).then(axios.spread((twoD, metalworks, threeD, knickknacks) => {
    updateBarnesObjects(twoD.data.hits.hits, 'twoD');
    updateBarnesObjects(metalworks.data.hits.hits, 'metalworks');
    updateBarnesObjects(threeD.data.hits.hits, 'threeD');
    updateBarnesObjects(knickknacks.data.hits.hits, 'knickknacks');

    DEV_LOG('Retrieved '+twoD.data.hits.total+' 2D objects.');
    DEV_LOG('Retrieved '+metalworks.data.hits.total+' metalworks.');
    DEV_LOG('Retrieved '+threeD.data.hits.total+' 3D objects.');
    DEV_LOG('Retrieved '+knickknacks.data.hits.total+' knickknacks.');

    checkBarnesificationPossible() ? setBarnesObjects() : dispatch(setObjects(objects));
    dispatch(setIsPending(false));
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

const setMaxHits = (maxHits) => {
  return {
    type: ActionTypes.QUERY_SET_MAX_HITS,
    maxHits: maxHits
  };
}

const setLastIndex = (lastIndex) => {
  return {
    type: ActionTypes.QUERY_SET_LAST_INDEX,
    lastIndex: lastIndex
  };
}

const setIsPending = (isPending) => {
  return {
    type: ActionTypes.QUERY_SET_IS_PENDING,
    isPending: isPending
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
  let body = buildRequestBody(fromIndex);
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
    'fields': [
      "tags.*",
      "tags.*.tag",
      "color.palette-color-*",
      "color.average-*",
      "color.palette-closest-*",
      "title",
      "people",
      "medium",
      "shortDescription",
      "longDescription",
      "visualDescription",
      "curvy",
      "vertical",
      "diagonal",
      "horizontal",
      "light",
      "line",
      "space",
      "light_desc_*",
      "color_desc_*",
      "comp_desc_*",
      "generic_desc_*"
    ],
    'min_term_freq': 1,
    'minimum_should_match': `${minShouldMatch}%`
  });
  body = body.build();

  let options = {
    barnesify: false,
    append: !!fromIndex,
    highlights: false
  };

  return (dispatch) => {
    fetchResults(body, dispatch, options);
  }
}

export const getEnsembleObjects = (ensembleIndex) => {
  let body = buildRequestBody(0, 125);
  body = body.query('match', 'ensembleIndex', ensembleIndex);
  body = body.build();

  let options = {
    barnesify: false,
    append: false,
    highlights: false
  };

  return (dispatch) => {
    fetchResults(body, dispatch, options);
  }
}

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

    let body = buildRequestBody(fromIndex);
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
      case 'color':
        filter.queries.forEach((query) => {
          queries.push(buildColorQuery(query));
        })
        break;
      case 'line':
        if (filter.filterGroup === 'composition') {
          queries.push(buildRangeQuery(filter.name, { 'gte': BARNES_SETTINGS.line_threshhold }));
        } else if (filter.filterGroup === 'linearity') {
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
              break;
          }
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

    let body = buildRequestBody(fromIndex);

    body = body.query(
      'multi_match': {
        'query': term,
        'fields': [
          "tags.*",
          "tags.*.tag",
          "title.*",
          "people.*",
          "medium.*",
          "shortDescription.*",
          "longDescription.*",
          "visualDescription.*"
        ]
      }
    );

    body = body.build();

    if (fromIndex >= 25) options.append = true;

    fetchResults(body, dispatch, options);
  }
}

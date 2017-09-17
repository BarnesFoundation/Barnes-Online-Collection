import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const BARNES_SETTINGS = {
  min2D: 10,
  minMetalworks: 7,
  min3D: 5,
  minKnickKnacks: 2,
  minObjects: 14,
  terms2D: ['Architecture', 'Paintings', 'Drawings', 'Works on Paper', 'Prints', 'Enamels', 'Manuscripts', 'Photographs'],
  termsMetalworks: ['Metalworks'],
  terms3D: ['Sculptures', 'Furniture', 'Timepieces'],
  termsKnickKnacks: ['Flatware', 'Jewelry', 'Lighting Devices', 'Textiles', 'Tools and Equipment', 'Vessels'],
  size: 25,
  line_threshhold: 0.5,
  broken_threshhold: 0
};

const buildRequestBody = (fromIndex=0) => {
  let body = bodybuilder()
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
  console.log('Fetching results...');
  axios.get('/api/search', { params: { body: body } })
  .then((response) => {
    const objects = mapObjects(response.data.hits.hits);
    console.log('Retrieved', objects.length, 'objects.' );
    const maxHits = response.data.hits.total;
    const lastIndex = body.from + body.size;

    dispatch(setMaxHits(maxHits));
    dispatch(setLastIndex(lastIndex));

    if (options.barnesify && maxHits >= 25) {
        barnesifyObjects(objects, dispatch, options);
    } else {
      options.append ? dispatch(appendObjects(objects)) : dispatch(setObjects(objects));
    }
  });
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
  console.log('Beginning Barnesification process...');
  let barnesObjects = {
    twoD: [],
    metalworks: [],
    threeD: [],
    objects: [],
    knickknacks: []
  };

  const updateBarnesObjects = (objects, type) => {
    barnesObjects[type].push(...objects);
  }

  const setBarnesObjects = () => {
    let ratios = {
      '2D': 0,
      metalworks: 0,
      '3D': 0,
      '3D+Metalworks': 0,
      total: 0
    };

    console.log('Compiling Barnesified object set...');
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

    console.log('Total objects:', ratios.total);
    console.log('2D:', ratios['2D'], 'objects', '/', ratios['2D']/ratios.total);
    console.log('metalworks:', ratios['metalworks'], 'objects', '/', ratios['metalworks']/ratios.total);
    console.log('3D:', ratios['3D'], 'objects', '/', ratios['3D']/ratios.total);
    console.log('Knick Knacks:', ratios['knickknacks'], 'objects', '/',  ratios['knickknacks']/ratios.total);

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
    if (barnesObjects.metalworks.length >= BARNES_SETTINGS.minMetalworks) {
      if (barnesObjects.threeD.length >= BARNES_SETTINGS.min3D) {
        return true;
      } else {
        if ((barnesObjects.threeD.length + barnesObjects.knicknacks.length) >= (BARNES_SETTINGS.min3D + BARNES_SETTINGS.minKnickKnacks)) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if ((barnesObjects.threeD.length + barnesObjects.metalworks.length) >= (BARNES_SETTINGS.minMetalworks + BARNES_SETTINGS.min3D)) {
        return true;
      } else {
        return false;
      }
    }
  }

  axios.get('/api/search', params(BARNES_SETTINGS.terms2D))
  .then((response) => {
    if (response.data.hits.total >= BARNES_SETTINGS.min2D) {
      console.log('Retrieved', response.data.hits.total, '2D objects. Proceeding...');
      updateBarnesObjects(response.data.hits.hits, 'twoD');

      axios.get('/api/search', params(BARNES_SETTINGS.termsMetalworks))
      .then((response) => {
        console.log('Retrieved', response.data.hits.total, 'metalworks. Proceeding...');
        updateBarnesObjects(response.data.hits.hits, 'metalworks');

        axios.get('/api/search', params(BARNES_SETTINGS.terms3D))
        .then((response) => {
          console.log('Retrieved', response.data.hits.total, '3D objects. Proceeding...');
          updateBarnesObjects(response.data.hits.hits, 'threeD');
          axios.get('/api/search', params(BARNES_SETTINGS.termsKnickKnacks))
          .then((response) => {
            console.log('Retrieved', response.data.hits.total, 'knickknacks. Proceeding...');
            updateBarnesObjects(response.data.hits.hits, 'knickknacks');

            if (checkBarnesificationPossible()) {
              setBarnesObjects();
            } else {
              dispatch(setObjects(objects));
            }
          })
        });
      });
    } else {
      console.log('Not enough 2D objects to Barnesify. Aborting...')
      dispatch(setObjects(objects));
    }
  });
}

const setObjects = (objects) => {
  console.log('Setting objects...');
  return {
    type: ActionTypes.SET_OBJECTS,
    payload: objects
  };
}

const appendObjects = (objects) => {
  console.log('Appending objects...');
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

export const getRelatedObjects = (objectID, fromIndex=0) => {
  return (dispatch) => {

  }
}

export const getEnsembleObjects = (ensembleIndex) => {
  let body = buildRequestBody(0, 10000);
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
      filters.ordered.length === 1 && !filters.line.linearity
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
          queries.push(buildRangeQuery(filter, { 'gte': BARNES_SETTINGS.line_threshhold }));
        } else if (filter.filterGroup === 'linearity') {
          switch (filter.name) {
            case 'unbroken':
              queries.push(buildRangeQuery(filter, { 'gte': BARNES_SETTINGS.broken_threshhold }));
              break;
            case 'broken':
              queries.push(buildRangeQuery(filter, { 'lte': BARNES_SETTINGS.broken_threshhold }));
              break;
            case 'all types':
              break;
            default:
              break;
          }
        }
        break;
      case 'light':
      case 'space':
        queries.push(buildRangeQuery(filter, { 'gte': (filter.value / 100) }));
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
        'color.palette-closest-*',
        'color.palette-color-*',
        'color.average-closest',
        'color.average-color'
      ]
    }
  };
}

const buildRangeQuery = (filter, query) => {
  let queryObject = { range: {} };
  queryObject['range'][filter.name] = query;
  return queryObject;
}

const assembleDisMaxQuery = (body, queries) => {
  return body.query('dis_max', {
    'queries': queries
  });
}

export const searchObjects = (term, fromIndex=0) => {
  return (dispatch) => {
    let options = {};

    if (term.length === 0) {
      return getAllObjects()(dispatch);
    }

    let body = buildRequestBody(fromIndex);
    body = body.query('match', '_all', term);
    body = body.build();

    if (fromIndex >= 25) options.append = true;

    fetchResults(body, dispatch, options);
  }
}

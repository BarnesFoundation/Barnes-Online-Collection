import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const BARNES_SETTINGS = {
  min2D: 10,
  minMetalworks: 7,
  minObjects: 7,
  min3D: 5,
  terms2D: ['Paintings', 'Drawings', 'Works on Paper', 'Prints'],
  termsMetalworks: ['Metalworks'],
  terms3D: ['Vessels', 'Sculptures', 'Furniture', 'Jewelry', 'Tools and Equipment', 'Lighting Devices'],
  size: 25
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

    if (options.highlights) { console.log('Showing highlights only.'); }

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
    objects: []
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

    if (barnesObjects.metalworks.length >= BARNES_SETTINGS.minMetalworks) {
      refinedBarnesObjects.push(...barnesObjects.metalworks.slice(0, BARNES_SETTINGS.minMetalworks));
      ratios['metalworks'] = refinedBarnesObjects.length - ratios['2D'];

      refinedBarnesObjects.push(...barnesObjects.threeD.slice(0, BARNES_SETTINGS.size - refinedBarnesObjects.length));
      ratios['3D'] = refinedBarnesObjects.length - ratios['2D'] - ratios['metalworks'];
    } else {
      refinedBarnesObjects.push(...barnesObjects.objects.slice(0, BARNES_SETTINGS.size - refinedBarnesObjects.length));
      ratios['3D+Metalworks'] = refinedBarnesObjects.length - ratios['2D'];
    }

    ratios['total'] = refinedBarnesObjects.length;

    let objects = mapObjects(shuffleObjects(refinedBarnesObjects));

    console.log('Total objects:', ratios.total);
    console.log('2D:', ratios['2D'], 'objects', '/', ratios['2D']/ratios.total);
    console.log('metalworks:', ratios['metalworks'], 'objects', '/', ratios['metalworks']/ratios.total);
    console.log('3D:', ratios['3D'], 'objects', '/', ratios['3D']/ratios.total);
    console.log('3D+Metalworks:', ratios['3D+Metalworks'], 'objects', '/',  ratios['3D+Metalworks']/ratios.total);

    dispatch(setObjects(objects));
  }

  const params = (terms) => {
    let body = buildRequestBody().query('terms', 'classification', terms);

    if (options.highlights) body = addHighlightsFilter(body);
    if (options.queries) body = assembleDisMaxQuery(body, options.queries);

    body = body.build();

    return { params: { body: body } };
  }

  axios.get('/api/search', params(BARNES_SETTINGS.terms2D))
  .then((response) => {
    if (response.data.hits.total >= BARNES_SETTINGS.min2D) {
      console.log('Retrieved', response.data.hits.total, '2D objects. Proceeding...');
      updateBarnesObjects(response.data.hits.hits, 'twoD');

      axios.get('/api/search', params(BARNES_SETTINGS.termsMetalworks))
      .then((response) => {
        if (response.data.hits.total >= BARNES_SETTINGS.minMetalworks) {
          console.log('Retrieved', response.data.hits.total, 'metalworks. Proceeding...');
          updateBarnesObjects(response.data.hits.hits, 'metalworks');

          axios.get('/api/search', params(BARNES_SETTINGS.terms3D))
          .then((response) => {
            console.log('Retrieved', response.data.hits.total, '3D objects. Proceeding...');
            updateBarnesObjects(response.data.hits.hits, 'threeD');
            setBarnesObjects();
          })
        } else {
          axios.get('/api/search', params(['Metalworks', ...BARNES_SETTINGS.terms3D]))
          .then((response) => {
            if (response.data.hits.total >= BARNES_SETTINGS.minObjects) {
              console.log('Retrieved', response.data.hits.total, 'metalworks + 3D objects. Proceeding...');
              updateBarnesObjects(response.data.hits.hits, 'objects');
              setBarnesObjects();
            } else {
              dispatch(setObjects(objects));
            }
          });
        }
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
    body = addHighlightsFilter(body).build();
    options.barnesify = true;
    options.highlights = true;
  } else {
    options.append = true;
    options.barnesify = false;
    body = body.build();
  }

  return (dispatch) => {
    fetchResults(body, dispatch, options);
  }
};

export const findFilteredObjects = (filters, fromIndex=0) => {
  return (dispatch) => {
    let options = {};

    if (!filters.ordered || filters.ordered.length === 0) {
      return getAllObjects()(dispatch);
    }

    if (!fromIndex) {
      options.barnesify = true;
    } else {
      options.barnesify = false;
      options.append = true;
    }

    const queries = buildQueriesFromFilters(filters.ordered);
    options.queries = queries;

    let body = buildRequestBody(fromIndex);
    body = assembleDisMaxQuery(body, queries);
    body = body.build();

    fetchResults(body, dispatch, options);
  }
}

const buildQueriesFromFilters = (filters) => {
  let queries = [];
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    switch (filter.filterType) {
      case 'color':
        for (let i = 0; i < filter.queries.length; i++) {
          queries.push(buildColorQuery(filter.queries[i]));
        }
        break;
      case 'line':
        queries.push(buildRangeQuery(filter, { 'gte': 0.5 }));
      case 'light':
      case 'space':
        queries.push(buildRangeQuery(filter, { 'gte': filter.value }));
      default:
        break;
    }
  }
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

const buildLightQuery = (query) => {}

const buildSpaceQuery = (query) => {}

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

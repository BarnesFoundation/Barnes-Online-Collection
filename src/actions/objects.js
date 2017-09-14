import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';

const buildRequestBody = (fromIndex=0, size=25) => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(fromIndex).size(size);

  return body;
}

const addHighlightsFilter = (body) => {
  console.log('highlights only!');
  return body.filter('match', 'highlight', 'true');
}

const mapObjects = (objects) => {
  return objects.map(object => Object.assign({}, object._source, { id: object._id }));
}

const fetchResults = (body, dispatch, append=false, barnesify=false, highlights=false, queries=null) => {
  axios.get('/api/search', {
    params: {
      body: body,
    }
  }).then((response) => {
    const objects = mapObjects(response.data.hits.hits);
    const maxHits = response.data.hits.total;

    dispatch(setMaxHits(maxHits));
    dispatch(setLastIndex(body.from + body.size));

    if (barnesify && maxHits > 25) {
        console.log('barnesifying...');
        barnesifyObjects(objects, dispatch, highlights, append, queries);
    } else {
      if (append) {
        dispatch(appendObjects(objects));
      } else {
        dispatch(setObjects(objects));
      }
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

const barnesifyObjects = (objects, dispatch, highlights=false, append=false, queries=null) => {
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
    let refinedBarnesObjects = barnesObjects.twoD.slice(0, BARNES_ALGORITHM.min2D);

    if (barnesObjects.metalworks.length >= BARNES_ALGORITHM.minMetalworks) {
      refinedBarnesObjects.push(...barnesObjects.metalworks.slice(0, BARNES_ALGORITHM.minMetalworks));
      refinedBarnesObjects.push(...barnesObjects.threeD.slice(0, BARNES_ALGORITHM.min3D));
    } else {
      refinedBarnesObjects.push(...barnesObjects.objects.slice(0, BARNES_ALGORITHM.minObjects));
    }

    let objects = mapObjects(shuffleObjects(refinedBarnesObjects));

    if (append) {
      dispatch(appendObjects(objects));
    } else {
      dispatch(setObjects(objects));
    }
  }

  const params = (terms) => {
    let body = buildRequestBody().query('terms', 'classification', terms);

    if (highlights) {
      body = addHighlightsFilter(body);
    }

    if (queries) {
      body = assembleDisMaxQuery(body, queries);
    }

    body = body.build();

    return { params: { body: body } };
  }

  axios.get('/api/search', params(BARNES_ALGORITHM.terms2D))
    .then((response) => {
      if (response.data.hits.total >= BARNES_ALGORITHM.min2D) {
        updateBarnesObjects(response.data.hits.hits, 'twoD');

        axios.get('/api/search', params(BARNES_ALGORITHM.termsMetalworks))
        .then((response) => {
          if (response.data.hits.total >= BARNES_ALGORITHM.minMetalworks) {
            updateBarnesObjects(response.data.hits.hits, 'metalworks');

            axios.get('/api/search', params(BARNES_ALGORITHM.terms3D))
            .then((response) => {
              updateBarnesObjects(response.data.hits.hits, 'threeD');
              setBarnesObjects();
            })
          } else {
            axios.get('/api/search', params(['Metalworks', ...BARNES_ALGORITHM.terms3D]))
            .then((response) => {
              if (response.data.hits.total >= BARNES_ALGORITHM.minObjects) {
                updateBarnesObjects(response.data.hits.hits, 'objects');
                setBarnesObjects();
              } else {
                dispatch(setObjects(objects));
              }
            });
          }
        });
      } else {
        dispatch(setObjects(objects));
      }
    });
}

const BARNES_ALGORITHM = {
  min2D: 10,
  minMetalworks: 7,
  minObjects: 7,
  min3D: 5,
  terms2D: ['Paintings', 'Drawings', 'Works on Paper', 'Prints'],
  termsMetalworks: ['Metalworks'],
  terms3D: ['Vessels', 'Sculptures', 'Furniture', 'Jewelry', 'Tools and Equipment', 'Lighting Devices'],
};

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

export const getFirstObjects = () => {
  let body = buildRequestBody();
  body = addHighlightsFilter(body).build();

  return (dispatch) => {
    fetchResults(body, dispatch, 'barnesify', true);
  }
}

export const getAllObjects = (fromIndex=0, append=false) => {
  let body = buildRequestBody(fromIndex, 25);
  let barnesify = false;
  let highlights = false;

  if (!append) {
    body = addHighlightsFilter(body).build();
    barnesify = true;
    highlights = true;
  } else {
    body = body.build();
  }

  return (dispatch) => {
    fetchResults(body, dispatch, append, barnesify, highlights);
  }
};

export const findFilteredObjects = (filters, fromIndex=0, append=false, barnesify=false) => {
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
        case 'line':
        case 'light':
        case 'space':
          queries.push(buildRangeGteQuery(filter));
        default:
          break;
      }
    }
    body = assembleDisMaxQuery(body, queries);
    body = body.build();

    const highlights = false;
    if (fromIndex === 0) { barnesify = true; }

    fetchResults(body, dispatch, append, barnesify, highlights, queries);
  }
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

// const buildLineQuery = (query) => {
//   let queryObject = { range: {} };
//   queryObject['range'][query.name] = {
//     "gte" : 0.5
//   };

//   return queryObject;
// }

const buildRangeGteQuery = (query) => {
  let queryObject = { range: {} };
  queryObject['range'][query.name] = {
    "gte": query.min
  }
  return queryObject;
}

const buildLightQuery = (query) => {}

const buildSpaceQuery = (query) => {}

const assembleDisMaxQuery = (body, queries) => {
  return body.query('dis_max', {
    'queries': queries
  });
}

export const searchObjects = (term, fromIndex=0, append=null) => {
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

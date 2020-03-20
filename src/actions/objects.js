import axios from 'axios';
import { getObjectsRequestBody } from '../helpers';
import {
  RESET_MOBILE_FILTERS,
  SET_OBJECTS,
  APPEND_OBJECTS,
  OBJECTS_QUERY_SET_HAS_MORE_RESULTS,
  OBJECTS_QUERY_SET_IS_PENDING,
  OBJECTS_QUERY_SET_LAST_INDEX,
  OBJECTS_QUERY_CURRENT_INDEX,
} from '../constants';
import { BARNES_SETTINGS, SEARCH_FIELDS } from '../barnesSettings';
import { DEV_LOG } from '../devLogging';
import { DROPDOWN_TERMS } from '../components/SearchInput/Dropdowns/Dropdowns';
import { uniqBy } from 'lodash';

const RAW_OPTION = [
  "id",
  "title",
  "people",
  "medium",
  "imageOriginalSecret",
  "imageSecret",
  "ensembleIndex",
];

const resetMobileFilters = () => ({ type: RESET_MOBILE_FILTERS });
const setObjects = objects => ({ type: SET_OBJECTS, payload: objects });
const appendObjects = objects => ({ type: APPEND_OBJECTS, payload: objects });
const setHasMoreResults = hasMoreResults => ({ type: OBJECTS_QUERY_SET_HAS_MORE_RESULTS, hasMoreResults });
const setIsPending = isPending => ({ type: OBJECTS_QUERY_SET_IS_PENDING, isPending });
const setLastIndex = lastIndex => ({ type: OBJECTS_QUERY_SET_LAST_INDEX, lastIndex });
const setCurrentIndex = currentIndex => ({ type: OBJECTS_QUERY_CURRENT_INDEX, currentIndex });



const addHighlightsFilter = (body) => {
  const highlightFilter = {
    "bool": {
      "must": [{
        "exists": {
          "field": "imageSecret"
        }
      }, {
        "match": {
          "highlight": "true"
        }
      }]
    }
  };

  return body
    // note: These random_score values were mostly copy-pasted from this example:
    // https://www.elastic.co/guide/en/elasticsearch/reference/5.3/query-dsl-function-score-query.html#function-random
    // These values seem to work better than other adjustments, so I just left them.
    .query("function_score", {
      "query": {
        "match_all": {}
      },
      // value from 5.3 example
      "boost": "5",
      "functions": [{
        "filter": highlightFilter,
        // This should default to the current timestamp and add randomness.
        "random_score": {},
        // value from 5.3 example
        "weight": 23
      }],
      // value and modes from 5.3 example
      "max_boost": 42,
      "score_mode": "max",
      "boost_mode": "multiply"
    });
};

const mapObjects = (objects) => (
  uniqBy(objects, '_id').map(object => Object.assign({}, object._source, { highlight: object.highlight } , { id: object._id }))
);

const fetchResults = async (body, dispatch, options = {}) => {
  if (!options.append) dispatch(setIsPending(true));

  try {
    const res = await axios.get('/api/search', { params: { body: body } });

    const lastIndex = (res.data.hits && res.data.hits.total) ? res.data.hits.total.value : 0;
    const objects = res.data.hits ? mapObjects(res.data.hits.hits) : [];
    const maxHits = res.data.hits ? res.data.hits.total : 0;
    const hasMoreResults = maxHits > lastIndex;

    dispatch(setLastIndex(lastIndex));
    // dispatch(setCurrentIndex(getState().objectsQuery.currentIndex + 50))
    dispatch(setHasMoreResults(hasMoreResults));

    if (options.barnesify && (maxHits >= BARNES_SETTINGS.size)) {
      await barnesifyObjects(objects, dispatch, options); // note, dispatch(setObjects(barnesifiedObjects)) is called from within barnesifyObjects
    } else {
      options.append ? dispatch(appendObjects(objects)) : dispatch(setObjects(objects));
      dispatch(resetMobileFilters());
    }
    
  } catch (e) {
    console.error(e);
    console.error('Error fetching results.');
  } finally {
    if (!options.append) dispatch(setIsPending(false));
  }
};


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

  const get2DObjects = () => axios.get('/api/search', params(BARNES_SETTINGS.terms2D));
  const getMetalworks = () => axios.get('/api/search', params(BARNES_SETTINGS.termsMetalworks));
  const get3DObjects = () => axios.get('/api/search', params(BARNES_SETTINGS.terms3D));
  const getKnickKnacks = () => axios.get('/api/search', params(BARNES_SETTINGS.termsKnickKnacks));

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
};


export const getNextObjects = (currentNumberofObjects) => ((dispatch, getState) => {
  const state = getState();

  const { currentIndex } = state.objectsQuery;
  const filters = state.filters;

  if (currentNumberofObjects > currentIndex + BARNES_SETTINGS.size) {
    findFilteredObjects(filters, currentIndex + BARNES_SETTINGS.size)(dispatch);
    dispatch(setCurrentIndex(currentIndex + BARNES_SETTINGS.size));
  }
});

export const getAllObjects = (fromIndex = 0) => {
  let body = getObjectsRequestBody(fromIndex);

  body = addHighlightsFilter(body);

  const options = {
    barnesify: true,
    highlights: true,
    append: Boolean(fromIndex),
  }
  

  body = body
    .rawOption('_source', RAW_OPTION)
    .build();

  return (dispatch) => {
    dispatch(setCurrentIndex(fromIndex));
    fetchResults(body, dispatch, options);
  };
};

export const findFilteredObjects = (filters, fromIndex = 0) => {
  // If there is now no filter.
  if (
      (
        !filters.ordered ||
        filters.ordered.length === 0 || // Higher-level filters
        (filters.ordered.length === 1 && filters.ordered[0].name === 'all types')
      ) && 
      !Object.values(filters.advancedFilters).reduce((acc, advancedFilter) => acc + Object.keys(advancedFilter).length, 0) // If there is any advanced filter
    ) {
    return dispatch => getAllObjects(fromIndex)(dispatch);
  }

  const queries = buildQueriesFromFilters(filters.ordered);

  const options = {
    queries: queries,
    barnesify: !fromIndex,
    append: Boolean(fromIndex)
  };

  let body = getObjectsRequestBody(
    fromIndex,
    Boolean(
      filters.advancedFilters[DROPDOWN_TERMS.ROOM] &&
      Object.keys(filters.advancedFilters[DROPDOWN_TERMS.ROOM]).length
    )
  );

  if (filters.ordered.filter(filter => filter.filterType !== 'search').length) {
    body = assembleDisMaxQuery(body, queries);
  }

  /**
   * Map over all advanced filters and mutate body.
   * TODO => See if we will use a param other than 'terms', otherwise add to body past the switch to keep it DRY.
   * @see Dropdowns.jsx for DROPDOWN_TERMS.
   */
  Object.entries(filters.advancedFilters)
    .filter(([, appliedFilters]) => appliedFilters && Object.keys(appliedFilters).length) // Filter out {}.
    .forEach(([filterType, appliedFilters]) => {
      switch(filterType) {
        case DROPDOWN_TERMS.CULTURE: {
          // Map over terms, place into single array like ["American", "French"].
          body.query('terms', { 'culture.keyword': Object.values(appliedFilters).map(({ term }) => term) });
          break;
        }
        case DROPDOWN_TERMS.YEAR: {
          const { dateRange: { term: { beginDate, endDate }}} = appliedFilters;

          body
            .query('range', 'beginDate', { 'gte': beginDate })
            .query('range', 'endDate', { 'lte': endDate });
          break;
        }
        case DROPDOWN_TERMS.CLASSIFICATION: {
          // Map over terms, place into single array like ["Charcoal on brown wove paper", "Pen and brown ink on brown wove paper"].
          body.query('terms', { 'classification': Object.values(appliedFilters).map(({ term }) => term) });
          break;
        }
        case DROPDOWN_TERMS.ROOM: {
          // Flatmap over all locations then parseInt flattened Array, placing all ensembleIndexes into single array like [77, 78, 79, 80, 81...].
          body.query(
            'terms',
            { ensembleIndex: Object.values(appliedFilters).flatMap(({ indexes }) => indexes) }
          );
          break;
        }
        case DROPDOWN_TERMS.COPYRIGHT: {
          // Map over terms, place into single array like ["copyrightA", "copyRightB"].
          body.query(
            'terms',
            { objRightsTypeId: Object.values(appliedFilters).flatMap(({ indexes }) => indexes) }
          );
          break;
        }
        case DROPDOWN_TERMS.ARTIST: {
          // Map over terms, place into single array like ["Pablo Picasso", "Amedeo Modigliani"].
          body.query('terms', { 'people.text': Object.values(appliedFilters).map(({ term }) => term) });
          body.sort('endDate', 'desc');
          break;
        }
        default: {
          console.error(`Missing filter type: ${filterType}.`);
        }
      }
  });

  body.rawOption('_source', RAW_OPTION);

  body = body.build();
  

  body.highlight = { 'fields': {} };
	body.highlight.fields = {
		...(SEARCH_FIELDS.reduce((acc, sf) => {
			acc[sf] = {}
			return acc;
		}, {}))
	};

  if (filters.search) {    
    const query = {
      'multi_match': {
        query: filters.search.value || filters.search,
        fields: SEARCH_FIELDS,
      },
    };

    if (Array.isArray(body.query.bool['must'])) {
      body.query.bool['must'] = [
        ...body.query.bool['must'],
        query,
      ];
    } else if (body.query.bool['must']) {
      body.query.bool['must'] = [
        body.query.bool['must'],
        query,
      ];
    } else {
      body.query.bool['must'] = [query];
    }
  }

  if (filters.advancedFilters[DROPDOWN_TERMS.ARTIST] && Object.keys(filters.advancedFilters[DROPDOWN_TERMS.ARTIST]).length) {
    // Replace sort.
    body.sort = [{ endDate: { order: 'desc' }}, '_score'];
  }

  return dispatch => fetchResults(body, dispatch, options);
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
  return body
    .query('dis_max', {
      'queries': queries,
      'tie_breaker': '0.5'
    });
}

export const searchObjects = (term, fromIndex = 0) => {
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
    
    // Add the search fields to the highlight -- so we know what field caused an object to show up on search
    body.highlight = { 'fields': {} };
    body.highlight.fields = {
      ...(SEARCH_FIELDS.reduce((acc, sf) => {
        acc[sf] = {}
        return acc;
      }, {}))
    }
    
    body.query.bool['must'] = [{ 'multi_match': query }];
    if (fromIndex >= 50) options.append = true;

    fetchResults(body, dispatch, options);
  }
}

import * as ActionTypes from '../constants';
import { filterSetsInitialState } from './filterSets';

const initialState = {
  colors: null,
  lines_composition: null,
  lines_linearity: null,
  light: null,
  space: null,
  search: null,
  /** 
   * This is a copy of DROPDOWNS_TERM_MAP.
   * @see Dropdown.jsx. */
  advancedFilters: {
    Artist: {},
    Copyright: {},
    Location: {},
    Medium: {},
    Year: {},
    Culture: {},
  },
  ordered: [],
};

/**
 * Filter out item from ordered set.
 * @param {[object]} orderedSet - array of filter objects.
 * @param {string} filterType - string to filter out.
 * @returns {[object]} - array of filter objects with string arg filtered out.
 */
const removeFromOrderedSet = (orderedSet, filterType) => (
  orderedSet.filter(filterEl => filterEl.filterType !== filterType)
);

const getFilterSetData = (setType) => {
  const { sets } = filterSetsInitialState;

  switch (setType) {
    case 'colors': return sets.colors.options;
    case 'lines_composition': return sets.lines.options.composition;
    case 'lines_linearity': return sets.lines.options.linearity;
    default: return null;
  }
};

/**
 * Get highest index key from filters.
 * This is to keep filters in order on adding them.
 * @param {[Object]} array - array of filter objects
 * @returns {number} highest index in array.
 */
const getHighestIndex = array => array.reduce((acc, { index }) => Math.max(acc, index), 0);

const filtersReducer = (state = initialState, { type, filter, filters = {} }) => {
  const filterType = filter ? filter.filterType : null;

  // Index to keep ordering correct between ordered array and advancedFilters object.
  const index = Math.max(
    getHighestIndex(state.ordered), // Get indexes in array
    getHighestIndex(
      Object.values(state.advancedFilters) // Get advanced filter subitems.
        .flatMap(advancedFilter => Object.values(advancedFilter)) // Flatmap over all subitems.
    ),
  ) + 1; // Add 1 to max number.

  switch (type) {
    case ActionTypes.ADD_FILTER: {
      console.log(filter);

      return ({
        ...state, // Deep copy state.

        // For unique, higher-level filters, remove any existing filter of same type and replace it with the new filter.
        ordered: [...removeFromOrderedSet(state.ordered, filterType), { ...filter, index }], // Add filter w/ index.

        // The 'all types' works differently -- it acts as a clear
        [filterType]: !(filterType === 'lines_linearity' && filter.name === 'all types') ? filter : null,
      });
    };
    case ActionTypes.REMOVE_FILTER: {
      return ({
        ...state, // Deep copy state.
        ordered: removeFromOrderedSet(state.ordered, filterType), // Remove designated item.
        [filterType]: null, // Reset filter types.
      });
    }
    case ActionTypes.CLEAR_ALL_FILTERS: return initialState;
    case ActionTypes.SET_FILTERS: {
      const { advancedFilters, ...rest } = filters;

      // Get ordered array from queryString object.
      const ordered = Object.entries(rest)
        .map(([filterType, filterVal]) => {
          // For selection filters.
          if (filterType === 'colors' || filterType === 'lines_composition' || filterType === 'lines_linearity') {  
            return getFilterSetData(filterType).find(filter => filter.name === filterVal);

          // For slider filters.
          } else if (filterType === 'light' || filterType === 'space') {
            return ({
              ...filterSetsInitialState.sets[filterType].filter, // Spread filter
              value: filterVal // and add new value.
            });
          } else if (filterType === 'search') {
            return ({ filterType: 'search', value: filterVal.value || filterVal });
          }
        })
        .map((obj, index) => ({ ...obj, index })) // Add index to all filter sets.
        .filter(Boolean); // Filter out nulls

      return ({
        ...initialState,
        ...rest,
        ordered,
        advancedFilters,
      });
    };
    case ActionTypes.ADD_ADVANCED_FILTER: {
      const { advancedFilters } = state;

      return {
        // Take a deep breath.
        ...state, // Deep copy existing state via spread.
        advancedFilters: { // Append new advanced filters.
          ...advancedFilters, // Deep copy existing advanced filter via spread.
          [filterType]: { // Append attribute of filter type.
            ...advancedFilters[filterType], // Spread existing advanced filter type.
            [filter.term]: { filterType, value: filter.value, term: filter.term, index }, // Add filter into advanced filter type.
          }
        }
      };
    };
    case ActionTypes.REMOVE_ADVANCED_FILTER: {
      const { advancedFilters } = state;

      // For immediate properties of advancedFilters, e.g. artist, culture, etc.
      const { [filterType]: { 
        [filter.term]: filterTerm, ...rest // Drop the current term, we will use ...rest to fill in filter type w/o removed key.
      }} = advancedFilters;

      return {
        ...state, // Deep copy existing state via spread.
        advancedFilters: { // Append new advanced filters.
          ...advancedFilters, // Deep copy existing advanced filter via spread.
          [filterType]: { ...rest } // Spread subfilter with filter.term removed.
        }
      };
    }
    default: return state;
  }
}

export default filtersReducer;

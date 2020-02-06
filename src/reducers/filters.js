import * as ActionTypes from '../constants';
import { selectRandomFilters, selectChosenFilters } from '../reducers/filterSets';

const initialState = {
  colors: null,
  lines_composition: null,
  lines_linearity: null,
  light: null,
  space: null,
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

const removeFromOrderedSet = (orderedSet, filterType) => (
  orderedSet.filter(filterEl => filterEl.filterType !== filterType)
)

// Refactored existing code into this function.
// It's a little weird to have these initial null values,
// but this is the form it wants to be in with the data passed to the 'ordered' property.
const buildFilterStateObject = ordered => ({ ...initialState, ordered });

const filters = (state = initialState, { type, filter }) => {
  const filterType = filter ? filter.filterType : null;

  switch (type) {
    case ActionTypes.ADD_FILTER: {
      return ({
        ...state, // Deep copy state.

        // For unique, higher-level filters, remove any existing filter of same type and replace it with the new filter.
        ordered: [...removeFromOrderedSet(state.ordered, filterType), filter],

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
    case ActionTypes.SHUFFLE_FILTERS: return buildFilterStateObject(selectRandomFilters());
    case ActionTypes.SET_FILTERS: {
      const selectedFilters = selectChosenFilters(filters || {});
      return buildFilterStateObject(selectedFilters);
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
            [filter.term]: { filterType, value: filter.value, term: filter.term }, // Add filter into advanced filter type.
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

export default filters;

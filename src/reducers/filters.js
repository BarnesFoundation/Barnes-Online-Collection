import * as ActionTypes from '../constants';
import { filterSetsInitialState } from './filterSets';
import { DEV_WARN } from '../devLogging';

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

const getSliderData = sliderType => filterSetsInitialState.sets[sliderType].filter;

const getFilterSetData = (setType) => {
  const { sets } = filterSetsInitialState;

  switch(setType) {
    case 'colors': return sets.colors.options;
    case 'lines_composition': return sets.lines.options.composition;
    case 'lines_linearity': return sets.lines.options.linearity;
    default: throw new Error('unexpected setType');
  }
}

const getRandomFilterFromSet = (setType) => {
  let set = getFilterSetData(setType);

  return set[Math.floor(Math.random()*set.length)];
}

const selectRandomFilters = () => {
  const getRandomSliderValue = (sliderType) => {
    let slider = getSliderData(sliderType);
    slider.value = Math.floor(Math.random() * 101);
    return slider;
  }

  const randomColorFilter = getRandomFilterFromSet('colors');
  const randomLineCompositionFilter = getRandomFilterFromSet('lines_composition');
  const randomLineLinearityFilter = getRandomFilterFromSet('lines_linearity');
  const randomLightFilter = getRandomSliderValue('light');
  const randomSpaceFilter = getRandomSliderValue('space');

  return [
    randomColorFilter,
    randomLineCompositionFilter,
    randomLineLinearityFilter,
    randomLightFilter,
    randomSpaceFilter
  ];
};

const getFilterDataByValue = (filterType, val) => {
  let filter;
  let set;

  // get set
  switch(filterType) {
    case 'colors':
      set = getFilterSetData(filterType);
      filter = set.find((filter) => {
        return filter.name === val;
      });
      break;
    case 'lines_composition':
    case 'lines_linearity':
      set = getFilterSetData(filterType);

      filter = set.find((filter) => {
        return filter.name === val;
      });
      break;
    case 'light':
    case 'space':
      let slider = getSliderData(filterType);

      slider.value = val;
      filter = slider;
      break;
    default:
      break;
  }

  // go! Return the filter
  return filter;
}

const selectChosenFilters = (filterSelection) => {
  // parse each key:value pair in the filterSelection
  const ret = Object.keys(filterSelection).map((filterType) => {
    const filterVal = filterSelection[filterType];
    const filterDataByValue = getFilterDataByValue(filterType, filterVal);

    if (!filterDataByValue) {
      DEV_WARN(`invalid filter value: ${filterType}:${filterVal}`);
    }

    return getFilterDataByValue(filterType, filterSelection[filterType]);
  });

  // filter out undefined invalid filters
  return ret.filter((validFilter) => {
    return validFilter;
  });
};

const filtersReducer = (state = initialState, { type, filter, filters = {} }) => {
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
      const selectedFilters = selectChosenFilters(filters);
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

export default filtersReducer;

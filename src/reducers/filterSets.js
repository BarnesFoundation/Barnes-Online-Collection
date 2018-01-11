import * as ActionTypes from '../constants';
import { COLOR_FILTERS, LINE_FILTERS } from '../filterSettings';

const buildInitialState = () => {
  var initialState = {
    visibleFilterSet: null,
    sets: {
      colors: {
        title: 'Colors',
        svgId: 'tool_colors',
        slug: 'colors',
        options: []
      },
      lines: {
        title: 'Lines',
        slug: 'lines',
        svgId: 'tool_lines',
        options: {
          composition: [],
          linearity: []
        }
      },
      light: {
        title: 'Light',
        slug: 'light',
        svgId: 'tool_lights',
        filter: {
          filterType: 'light',
          slug: 'light',
          svgId: 'tool_lights',
          name: 'light'
        }
      },
      space: {
        title: 'Space',
        slug: 'space',
        svgId: 'tool_space',
        filter: {
          filterType: 'space',
          slug: 'space',
          svgId: 'tool_space',
          name: 'space'
        }
      },
      shuffle: {
        title: '',
        slug: 'shuffle',
        svgId: 'shuffle',
        tooltip: 'Shuffle',
        type: 'shuffle'
      },
      search: {
        title: 'Keyword',
        slug: 'search',
        svgId: 'search',
        tooltip: 'Search a keyword, artist…',
        type: 'search',
      }
    }
  };

  for (let i = 0; i < COLOR_FILTERS.length; i++) {
    let colorFilter = {
      filterType: 'colors',
      slug: 'color-'+COLOR_FILTERS[i].name,
      name: COLOR_FILTERS[i].name,
      color: COLOR_FILTERS[i].buttonColor,
      queries: COLOR_FILTERS[i].queries,
    };

    initialState.sets.colors.options.push(colorFilter);
  }

  for (let i = 0; i < LINE_FILTERS.composition.length; i++) {
    let lineFilter = LINE_FILTERS.composition[i];
    lineFilter.filterType = 'lines_composition';
    lineFilter.slug = 'line-'+lineFilter.name;
    lineFilter.svgId = lineFilter.svgId;

    initialState.sets.lines.options.composition.push(lineFilter);
  }

  for (let i = 0; i < LINE_FILTERS.linearity.length; i++) {
    let lineFilter = LINE_FILTERS.linearity[i];
    lineFilter.filterType = 'lines_linearity';
    lineFilter.slug = 'line-'+lineFilter.name;
    lineFilter.svgId = lineFilter.svgId;

    initialState.sets.lines.options.linearity.push(lineFilter);
  }

  return initialState;
}

const initialState = buildInitialState();

const getFilterSetData = (setType) => {
  const sets = initialState.sets;
  let set;

  // get set
  switch(setType) {
    case 'colors':
      set = sets.colors.options;
      break;
    case 'lines_composition':
      set = sets.lines.options.composition;
      break;
    case 'lines_linearity':
      set = sets.lines.options.linearity;
      break;
    default:
      throw new Error('unexpected setType');
  }

  // go! Return set.
  return set;
}

const getSliderData = (sliderType) => {
  return initialState.sets[sliderType].filter;
}

const getRandomFilterFromSet = (setType) => {
  let set = getFilterSetData(setType);

  return set[Math.floor(Math.random()*set.length)];
}

const getRandomSliderValue = (sliderType) => {
  let slider = getSliderData(sliderType);
  slider.value = Math.floor(Math.random() * 101);

  return slider;
}

export const selectRandomFilters = () => {
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
}

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

export const selectChosenFilters = (filterSelection) => {
  // parse each key:value pair in the filterSelection
  const ret = Object.keys(filterSelection).map((filterType) => {
    return getFilterDataByValue(filterType, filterSelection[filterType]);
  });

  return ret;
}

const filterSets = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SELECT_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: action.slug });
    case ActionTypes.CLOSE_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: null });
    default:
      return state;
  }
}

export default filterSets;

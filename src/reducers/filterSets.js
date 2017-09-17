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
        title: '',
        slug: 'search',
        svgId: 'search',
        tooltip: 'Search a keyword, artist…',
        type: 'search'
      }
    }
  };

  for (let i = 0; i < COLOR_FILTERS.length; i++) {
    let colorFilter = {
      filterType: 'color',
      slug: 'color-'+COLOR_FILTERS[i].name,
      name: COLOR_FILTERS[i].name,
      color: COLOR_FILTERS[i].buttonColor,
      queries: COLOR_FILTERS[i].queries,
    };

    initialState.sets.colors.options.push(colorFilter);
  }

  for (let i = 0; i < LINE_FILTERS.composition.length; i++) {
    let lineFilter = LINE_FILTERS.composition[i];
    lineFilter.filterType = 'line';
    lineFilter.slug = 'line-'+lineFilter.name;
    lineFilter.svgId = lineFilter.svgId;

    initialState.sets.lines.options.composition.push(lineFilter);
  }

  for (let i = 0; i < LINE_FILTERS.linearity.length; i++) {
    let lineFilter = LINE_FILTERS.linearity[i];
    lineFilter.filterType = 'line';
    lineFilter.slug = 'line-'+lineFilter.name;
    lineFilter.svgId = lineFilter.svgId;

    initialState.sets.lines.options.linearity.push(lineFilter);
  }

  return initialState;
}

const initialState = buildInitialState();

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

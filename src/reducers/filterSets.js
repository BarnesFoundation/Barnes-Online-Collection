import { SELECT_FILTER_SET, CLOSE_FILTER_SET, TOGGLE_ARTIST_MENU } from '../constants';
import { COLOR_FILTERS, LINE_FILTERS } from '../filterSettings';

const initialState = {
  visibleFilterSet: null,
  isArtistMenuToggled: false,
  sets: {
    colors: {
      title: 'Colors',
      svgId: 'tool_colors',
      slug: 'colors',
      options: COLOR_FILTERS.map((colorFilter) => (
        {
          ...colorFilter,
          filterType: 'colors',
          slug: `color-${colorFilter.name}`,
          name: colorFilter.name,
          color: colorFilter.buttonColor,
          queries: colorFilter.queries,
        }
      )),
    },
    lines: {
      title: 'Lines',
      slug: 'lines',
      svgId: 'tool_lines',
      options: {
        composition: LINE_FILTERS.composition.map((lineFilterComposition) => ({
          ...lineFilterComposition,
          filterType: 'lines_composition',
          slug: `line-${lineFilterComposition.name}`,
        })),
        linearity: LINE_FILTERS.linearity.map((lineFilterLinearity) => ({
          ...lineFilterLinearity,
          filterType: 'lines_linearity',
          slug: `line-${lineFilterLinearity.name}`
        }))
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
    search: {
      title: 'Search Collection',
      slug: 'search',
      svgId: 'filters',
      tooltip: 'Search a keyword, artist…',
      type: 'search',
    }
  }
};

const filterSets = (state = initialState, action) => {
  switch(action.type) {
    case SELECT_FILTER_SET: return Object.assign({}, state, { visibleFilterSet: action.slug });
    case CLOSE_FILTER_SET: return Object.assign({}, state, { visibleFilterSet: null });
    case TOGGLE_ARTIST_MENU: {
      const { isOpen } = action;
      const { isArtistMenuToggled, ...rest } = state;

      return {
        isArtistMenuToggled: isOpen,
        ...rest,
      }
    }
    default: return state;
  }
}

export default filterSets;
export { initialState as filterSetsInitialState };
import * as ActionTypes from '../constants';

const initialState = {
  visibleFilterSet: null,
  filterOptions: {
    colors: {
      title: "Colors",
      slug: "colors",
      type: "checkbox",
      options: [
        {
          slug: 'red',
          query: ['match', '_all', 'red']
        },
        {
          slug: 'blue',
          query: ['match', '_all', 'blue']
        },
        {
          slug: 'yellow',
          query: ['match', '_all', 'yellow']
        }
      ],
    },
    lines: {
      title: "Lines",
      slug: "lines",
      type: "radio"
    },
    light: {
      title: "Light",
      slug: "light",
      type: "slider"
    },
    space: {
      title: "Space",
      slug: "space",
      type: "slider"
    },
    // These aren't filters, so this gets a little muddy; should probably refactor.
    shuffle: {
      title: "Shuffle",
      slug: "shuffle",
      type: "shuffle"
    },
    search: {
      title: "Search",
      slug: "search",
      type: "search"
    }
  },
  filtersApplied: []
};

const filters = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SELECT_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: action.slug });
    case ActionTypes.ADD_TO_FILTERS:
      return Object.assign({}, state, { filtersApplied: [...state.filtersApplied, action.filter] });
    case ActionTypes.REMOVE_FROM_FILTERS:
    default:
      return state;
  }
}

export default filters;

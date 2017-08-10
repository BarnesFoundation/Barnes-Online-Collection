import * as ActionTypes from '../constants';

const initialState = {
  visibleFilterSet: null,
  sets: {
    colors: {
      title: "Colors",
      slug: "colors",
      type: "checkbox",
      options: [
        {
          slug: 'color-red',
          displayType: 'color',
          displayValue: 'red',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'red',
          applied: false
        },
        {
          slug: 'color-blue',
          displayType: 'color',
          displayValue: 'blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'blue',
          applied: false
        },
        {
          slug: 'color-yellow',
          displayType: 'color',
          displayValue: 'yellow',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'yellow',
          applied: false
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
  }
};

const filterSets = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SELECT_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: action.slug });
    default:
      return state;
  }
}

export default filterSets;

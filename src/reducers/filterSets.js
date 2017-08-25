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
          slug: 'color-sky-blue',
          name: 'sky-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'sky blue',
          color: '#71D5F8',
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#3C7CF6'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#0F48AF'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#192A72'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#211346'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#0E4349'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#0F4223'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#58871F'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#9AC12D'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#FFFC23'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#E69C17'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#EB6915'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#D8440E'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#CD130E'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#9D3469'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#6B2056'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#541439'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#6E6E6E'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#DCDCDC'
        },
        {
          slug: 'color-ultramarine-blue',
          name: 'ultramarine-blue',
          method: 'query',
          type: 'match',
          field: '_all',
          term: 'ultramarine blue',
          color: '#F0F0F0'
        },
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
      title: "",
      slug: "shuffle",
      type: "shuffle"
    },
    search: {
      title: "",
      slug: "search",
      type: "search"
    }
  }
};

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

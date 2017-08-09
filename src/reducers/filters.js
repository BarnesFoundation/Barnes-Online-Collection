import * as ActionTypes from '../constants';

const initialState = {
  visibleFilterSet: null,
  filterOptions: {
    colors: {
      title: "Colors",
      slug: "colors",
      type: "checkbox",
      options: {
        red: {
          slug: 'red'
        },
        blue: {
          slug: 'blue'
        },
        yellow: {
          slug: 'yellow'
        }
      }
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

const filters = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.SELECT_FILTER_SET:
      return Object.assign({}, state, { visibleFilterSet: action.slug });
    default:
      return state;
  }
}

export default filters;

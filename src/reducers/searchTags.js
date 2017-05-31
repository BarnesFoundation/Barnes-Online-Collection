import * as ActionTypes from '../constants';

const initialState = [
  'Cezanne',
  'Red',
  'Fruit',
  'Glackens',
  'Picasso',
  'Bowl',
  'Spoon'
];

const searchTags = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.RESET_SEARCHTAGS:
      return initialState;
    case ActionTypes.REMOVE_SEARCHTAG:
      return state.filter(tag => tag !== action.payload);
    default:
      return state;
  }
}

export default searchTags;
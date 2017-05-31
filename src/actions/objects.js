import axios from 'axios';
import * as ActionTypes from '../constants';
import { resetSearchTags } from './searchTags';

const setObjects = (objects) => {
  return {
    type: ActionTypes.SET_OBJECTS,
    payload: objects
  };
}

export const getObjects = () => {
  return (dispatch) => {
    dispatch(resetSearchTags());
    axios.get('/api/search', {
      params: {
        q: 'highlight:true'
      }
    }).then((response) => {
      const objects = response.data.hits.hits.map(object => object._source);
      console.log(objects);
      dispatch(setObjects(objects));
    });
  }
};

export const findObjectsByKeyword = (query) => {
  return (dispatch) => {
    if (query === '') {
      return getObjects()(dispatch);
    }
    axios.get('/api/search', {
      params: {
        q: `_all:${query}`
      }
    }).then((response) => {
      const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
      console.log(objects);
      dispatch(setObjects(objects));
    });
  }
}
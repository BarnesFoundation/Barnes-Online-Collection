import axios from 'axios';
import * as ActionTypes from '../constants';

export const setObject = (object) => {
  return {
    type: ActionTypes.SET_OBJECT,
    payload: object
  }
}

export const getObject = (id) => {
  return (dispatch) => {
    axios.get('/api/search', {
      params: {
        q: `_id:${id}`
      }
    }).then((response) => {
      const object = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }))[0];
      dispatch(setObject(object));
    });
  }
}

export const getSignedUrl = (invno) => {
  var newWindow = window.open('', '_blank');
  axios.get(`/api/objects/${invno}/original_signed_url`).then((response) => {
    newWindow.location = response.data.url;
  });
}

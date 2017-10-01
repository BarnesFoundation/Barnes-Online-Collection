import axios from 'axios';
import bodybuilder from 'bodybuilder';
import * as ActionTypes from '../constants';
import { DEV_LOG } from '../devLogging';

// todo: refactor to de-duplicate this logic from the ./objects.js file
const buildRequestBody = () => {
  let body = bodybuilder()
    .filter('exists', 'imageSecret')
    .from(0).size(25);

  return body;
}

export const setObject = (object) => {
  return {
    type: ActionTypes.SET_OBJECT,
    payload: object
  }
}

export const clearObject = () => {
  return {
    type: ActionTypes.CLEAR_OBJECT,
  }
}

export const getObject = (id) => {
  let body = buildRequestBody();
  body = body.query('match', '_id', id).build();

  return (dispatch) => {
    // clear the object first to avoid a FOUC when the modal changes to a new object
    // todo test this
    // dispatch(clearObject());
    // debugger;

    axios.get('/api/search', {
      params: {
        body: body
      }
    }).then((response) => {
      const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
      const object = objects.find(object => {
        return parseInt(object.id, 10)  ===  parseInt(id, 10);
      });

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

export const submitDownloadForm = (invno, field) => {
  return (dispatch) => {
    const newWindow = window.open('', '_blank');
    axios.post(`/api/objects/${invno}/download`, { field }).then((response) => {
      DEV_LOG(response.data.url);
      if (response.data.url) {
        newWindow.location = response.data.url;
      } else {
        newWindow.close();
      }
    });
  }
}

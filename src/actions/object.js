import axios from 'axios';
import { getObjectRequestBody } from '../helpers';
import * as ActionTypes from '../constants';
import { DEV_LOG } from '../devLogging';

const source = axios.CancelToken.source();

export const setObject = (object) => {
  return {
    type: ActionTypes.SET_OBJECT,
    payload: object
  }
}

export const clearObject = () => {
  return {
    type: ActionTypes.CLEAR_OBJECT,
    payload: {},
  }
}

export const getObject = (id) => {
  let body = getObjectRequestBody();

  body = body
    .query('match', '_id', id)
    .rawOption('_source', [
      "id",
      "title",
      "people",
      "medium",
      "imageOriginalSecret",
      "imageSecret", 
      "ensembleIndex",
      "objRightsTypeId",
      "onview",
      "invno",
      "image",
      "curatorialApproval",
      "shortDescription",
      "nationality",
      "birthDate",
      "deathDate",
      "artistPrefix",
      "artistSuffix",
      "culture",
      "displayDate",
      "medium",
      "dimensions",
      "creditLine",
      "longDescription",
      "bibliography",
      "exhHistory",
      "publishedProvenance"
    ])
    .build();

  return (dispatch) => {
    axios.get('/api/search', {
      params: {
        body: body
      },
      cancelToken: source.token
    }).then((response) => {
      if (response.data.hits.total === 0) {
        source.cancel(`No object with id '${id}' found`);
      } else {
        const objects = response.data.hits.hits.map(object => Object.assign({}, object._source, { id: object._id }));
        const object = objects.find(object => {
          return parseInt(object.id, 10)  ===  parseInt(id, 10);
        });

        dispatch(setObject(object));
      }
    }).catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        console.error(body);
        console.error(thrown);
      }
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

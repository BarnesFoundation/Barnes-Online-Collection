import axios from 'axios';
import * as ActionTypes from '../constants';
import { ui } from '../../shared/config';

const PRINTS_ENDPOINT = ui.printsEndpoint;

const setPrints = (prints) => {
  return {
    type: ActionTypes.SET_PRINTS,
    payload: prints
  };
}

export const getPrints = () => {
  return (dispatch) => {
    axios.get(PRINTS_ENDPOINT).then((response) => {
      dispatch(setPrints(response.data));
    });
  }
}
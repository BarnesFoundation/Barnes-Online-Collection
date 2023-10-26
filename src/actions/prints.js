import axios from "axios";
import * as ActionTypes from "../constants";

const PRINTS_ENDPOINT = process.env.REACT_APP_PRINTS_ENDPOINT;

const setPrints = (prints) => {
  return {
    type: ActionTypes.SET_PRINTS,
    payload: prints,
  };
};

export const getPrints = () => {
  return (dispatch) => {
    axios.get(PRINTS_ENDPOINT).then((response) => {
      dispatch(setPrints(response.data));
    });
  };
};

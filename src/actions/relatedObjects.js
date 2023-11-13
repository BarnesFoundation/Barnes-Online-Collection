import axios from "axios";
import * as ActionTypes from "../constants";
import { DEV_LOG } from "../devLogging";

const setIsPending = (isPending) => {
  return {
    type: ActionTypes.RELATED_OBJECTS_QUERY_SET_IS_PENDING,
    isPending: isPending,
  };
};

const setRelatedObjects = (objects) => {
  DEV_LOG("Setting related objects...");

  return {
    type: ActionTypes.SET_RELATED_OBJECTS,
    payload: objects,
  };
};

const clearRelatedObjects = () => {
  return {
    type: ActionTypes.CLEAR_RELATED_OBJECTS,
  };
};

export const getRelatedObjects = (objectID, value = 50) => {
  return (dispatch) => {
    DEV_LOG("Fetching related Objects results...");

    dispatch(setIsPending(true));
    // quick fix to avoid fouc.
    dispatch(clearRelatedObjects());

    const params = { objectID, dissimilarPercent: value };

    axios
      .get(`/api/related`, { params })
      .then((response) => {
        const hits = response.data.hits.hits;
        const objects = hits.map((object) =>
          Object.assign({}, object._source, { id: object._id })
        );

        DEV_LOG("Retrieved " + objects.length + " objects.");
        dispatch(setIsPending(false));
        dispatch(setRelatedObjects(objects));
      })
      .catch((thrown) => {
        console.error(`[error] getRelatedObjects: ${thrown.message}`);
      });
  };
};

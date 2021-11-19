import { getRoomName } from "../../ensembleIndex";
import { parseObject } from "../../objectDataUtils";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";

/**
 * Given an object, parses the images urls, and sets the content info and overlay text attributes
 */
 export const parseTourObject = (object, eyeSpy = false) => {
  object = parseObject(object);
  
  // If eye spy tour, set the clue as the caption and object meta data and description as overlay
  if (eyeSpy) {
    // TODO

  // Else default to object meta data as caption and description as overlay text
  } else {
    object.contentInfo = getObjectMetaDataHtml(object)
    object.overlayText = object.shortDescription
  }

  return object;
}

/**
 * Given a list of art objects, sorts the list into dictionary with 
 * room numbers as the keys and an array of art objects as the value
 */
export const sortObjectsByRoom = (objects) => {
  // Obj containing all art objects organized by room
  const objByRoom = {};
  for (const object of objects) {
    const room = getRoomName(object._source.ensembleIndex);
    // If key for this room doesn't exist, add it
    objByRoom[room] = objByRoom[room] ? objByRoom[room] : [];
    // Parse the object to set required attributes
    const parsedObject = parseTourObject(object._source);
    // Add object to room array
    objByRoom[room].push(parsedObject);
  }
  return objByRoom;
};

/**
 * Given an array with the room numbers in order and an array of art objects, 
 * returns an array of room objects with the section header and art object content.
 */
export const formatTourData = (roomOrder, objects) => {
  const tourData = [];
  // Get dictionary of art objects organized by room number
  const objByRoom = sortObjectsByRoom(objects);

  for (const room of roomOrder) {
    // If the dictionary has a key for that room, add it to the tourData array
    if (objByRoom[room]) {
      // Set the header and content for each tour section
      const roomData = {
        header: room,
        content: objByRoom[room],
      };
      tourData.push(roomData);
    }
  }

  return tourData;
};

import React from "react";
import parse from "html-react-parser";
import { getRoomName } from "../../ensembleIndex";
import { parseObject } from "../../objectDataUtils";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";

/**
 * Given an object, parses the images urls, and sets the content info and overlay text attributes
 */
 export const parseTourObject = (object, clues = undefined) => {
  object = parseObject(object);
  
  // If eye spy tour, set the clue as the caption and object meta data and description as overlay
  if (clues) {
    // Set the clue to be the object caption and object meta + description as overlay text
    object.contentInfo = (<p>{parse(clues[object.invno])}</p>)
    object.overlayText = (
      <div>
        {getObjectMetaDataHtml(object)}
        {object.shortDescription.length ? parse(object.shortDescription) : <span></span>}
      </div>
    )
  // Else default to object meta data as caption and description as overlay text
  } else {
    object.contentInfo = getObjectMetaDataHtml(object)
    object.overlayText = parse(object.shortDescription)
  }

  return object;
}

/**
 * Given a list of art objects, sorts the list into dictionary with 
 * room numbers as the keys and an array of art objects as the value
 */
export const sortObjectsByRoom = (objects, clues = undefined) => {
  // Obj containing all art objects organized by room
  const objByRoom = {};
  for (const object of objects) {
    // Get room name from the ensemble index
    const room = getRoomName(object._source.ensembleIndex);
    // If key for this room doesn't exist, add it
    objByRoom[room] = objByRoom[room] ? objByRoom[room] : [];
    // Parse the object to set required attributes
    const parsedObject = parseTourObject(object._source, clues);
    // Add object to room array
    objByRoom[room].push(parsedObject);
  }
  return objByRoom;
};

/**
 * Given an array with the room numbers in order and an array of art objects, 
 * returns an array of room objects with the section header and art object content.
 */
export const formatTourData = (roomOrder, objects, clues = undefined) => {
  const tourData = [];
  // Get dictionary of art objects organized by room number
  const objByRoom = sortObjectsByRoom(objects, clues);

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

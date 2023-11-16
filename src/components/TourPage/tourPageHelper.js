import React from "react";
import parse from "html-react-parser";
import { getRoomName } from "../../ensembleIndex";
import { parseObject } from "../../shared/utils";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";

/**
 * Given an object, parses the images urls, and sets the content info and overlay text attributes
 */
export const parseTourObject = (object, objectCopy) => {
  object = parseObject(object);
  let content = "";
  let overlay = "";

  if (objectCopy.description) {
    // content = (<div>
    //   {parse(objectCopy.description.html)}
    // </div>
    // )
    content = parse(objectCopy.description.html);
    overlay = getObjectMetaDataHtml(object);

    if (objectCopy.overlay) {
      overlay = (
        <div>
          {overlay}
          {parse(objectCopy.overlay.html)}
        </div>
      );
    } else if (object.shortDescription.length) {
      overlay = (
        <div>
          {overlay}
          {parse(object.shortDescription)}
        </div>
      );
    }
  } else {
    if (objectCopy.overlay) {
      overlay = parse(objectCopy.overlay.html);
    }
  }

  object.contentInfo = content ? content : getObjectMetaDataHtml(object);

  if (overlay) {
    object.overlayText = overlay;
  } else if (object.shortDescription.length) {
    object.overlayText = parse(object.shortDescription);
  }

  return object;
};

/**
 * Given a list of art objects, sorts the list into dictionary with
 * room numbers as the keys and an array of art objects as the value
 */
export const sortObjectsByRoom = (objects, objectsCopy) => {
  // Obj containing all art objects organized by room
  const objByRoom = {};
  for (const object of objects) {
    // Get room name from the ensemble index
    const room = getRoomName(object._source.ensembleIndex);
    // If key for this room doesn't exist, add it
    objByRoom[room] = objByRoom[room] ? objByRoom[room] : [];
    // Find the associated copy
    const objectCopy = objectsCopy.find(
      (copy) =>
        object._source.invno.toLowerCase() ===
        copy.inventoryNumber.toLowerCase()
    );
    // Parse the object to set required attributes
    const parsedObject = parseTourObject(object._source, objectCopy);
    // Add object to room array
    objByRoom[room].push(parsedObject);
  }
  return objByRoom;
};

/**
 * Given an array with the room numbers in order and an array of art objects,
 * returns an array of room objects with the section header and art object content.
 */
export const formatTourData = (roomOrder, objects, objectsCopy) => {
  const tourData = [];
  // Get dictionary of art objects organized by room number
  const objByRoom = sortObjectsByRoom(objects, objectsCopy);
  // TODO: handle when not all rooms are included
  // console.log(objByRoom)
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

/**
 * Given an locale abbreviation, returns the full string of the language name
 */
export const localeToLanguage = (locale) => {
  switch (locale) {
    case "es":
      return "Español";
    case "en":
    default:
      return "English";
  }
};

/**
 * Given a language, returns the locale abbreviation
 */
export const languageToLocale = (language) => {
  switch (language) {
    case "Español":
      return "es";
    case "English":
    default:
      return "en";
  }
};

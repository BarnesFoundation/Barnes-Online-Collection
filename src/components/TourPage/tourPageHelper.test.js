import { sortObjectsByRoom, formatTourData, parseTourObject } from "./tourPageHelper";
import { DEFAULT_ROOM_ORDER } from "../../constants";
import { getObjectMetaDataHtml } from "../ArtObjectPageComponents/PanelVisuallyRelated";

const data = require("../../../server/constants/tours/test");
const objectsCopy = data["tourData"]["collectionObjects"];
const objects = data["objects"]

describe("sortObjectsByRoom", () => {
  const objByRoom = sortObjectsByRoom(objects, objectsCopy);

  it("should sort the objects by room number", () => {
    expect(objByRoom["Main Room"].length).toBe(1);
    expect(objByRoom["Room 14"].length).toBe(2);
    expect(objByRoom["Room 19"].length).toBe(1);
    expect(objByRoom["Mezzanine"].length).toBe(3);
    expect(objByRoom["Gallery Foyer"].length).toBe(1);
  });

  it("should not include rooms without objects", () => {
    expect(objByRoom.hasOwnProperty("Room 13")).toBe(false);
    expect(objByRoom.hasOwnProperty("Room 15")).toBe(false);
    expect(objByRoom.hasOwnProperty("Room 18")).toBe(false);
    expect(objByRoom.hasOwnProperty("Room 20")).toBe(false);
    expect(objByRoom.hasOwnProperty("Lower Lobby")).toBe(false);
  });
});

describe("formatTourData", () => {
  const tourData = formatTourData(DEFAULT_ROOM_ORDER, objects, objectsCopy);

  it("should properly format room data object", () => {
    expect(tourData[0].header).toBe("Main Room");
    expect(tourData[0].content.length).toBe(1);
    expect(tourData.length).toBe(5);
  });

  it("should not include rooms without objects", () => {
    const tourRooms = tourData.filter((tour) => tour.header);
    expect(tourRooms).not.toEqual(
      expect.arrayContaining([
        "Room 13",
        "Room 15",
        "Room 18",
        "Room 20",
        "Second Floor Balcony West (Room 24)",
      ])
    );
  });

  it("should properly format room data object when room numbers are not included", () => {
    const tourData = formatTourData(DEFAULT_ROOM_ORDER, objects, objectsCopy, false);
    expect(tourData[0].header).toBe(undefined);
    expect(tourData[0].content.length).toBe(8);
    expect(tourData.length).toBe(1);
  });
});

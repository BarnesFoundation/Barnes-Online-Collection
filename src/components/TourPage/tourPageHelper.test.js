import { sortObjectsByRoom, formatTourData } from "./tourPageHelper";
import { DEFAULT_ROOM_ORDER } from "./TourPage";

const objects = require("../../../server/constants/tours.json")["test-tour"][
  "data"
]["hits"]["hits"];

describe("sortObjectsByRoom", () => {
  const objByRoom = sortObjectsByRoom(objects);

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
  const tourData = formatTourData(DEFAULT_ROOM_ORDER, objects);

  it("should properly format room data object", () => {
    expect(tourData[0].header).toBe("Main Room");
    expect(tourData[0].content.length).toBe(1);
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
});

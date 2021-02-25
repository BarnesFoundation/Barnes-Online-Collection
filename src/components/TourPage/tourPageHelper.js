import { getRoomName } from "../../ensembleIndex";

export const sortObjectsByRoom = (objects) => {
  const objByRoom = {};
  for (const object of objects) {
    const room = getRoomName(object._source.ensembleIndex);
    objByRoom[room] = objByRoom[room] ? objByRoom[room] : [];
    objByRoom[room].push(object._source);
  }
  return objByRoom;
};

export const formatTourData = (roomOrder, objects) => {
  const tourData = [];
  const objByRoom = sortObjectsByRoom(objects);

  for (const room of roomOrder) {
    if (objByRoom[room]) {
      const roomData = {
        header: room,
        content: objByRoom[room],
      };
      tourData.push(roomData);
    }
  }

  return tourData;
};

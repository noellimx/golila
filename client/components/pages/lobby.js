import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS, UPDATE_TEXT } from "../helpers.js";

const getroomCreationFormRequestDiv = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "frame-room-create");

  // ELEMENT - fieldRoomName
  const fieldRoomName = newTextInput();

  // ELEMENT - button

  const button = newButton();
  UPDATE_TEXT(button, "+ and -> Room");

  let onCreateRoomRequest = NO_OP;
  button.addEventListener("click", () => {
    console.log(`[button create room onclick] `);
    const roomName = fieldRoomName.value;
    onCreateRoomRequest(roomName);
  });

  // ELEMENT - descript

  const descDiv = newDivTag();

  const whenCreateRoomRequest = (fn) => {
    onCreateRoomRequest = fn;
  };

  const roomCreationResponse = (result) => {
    console.log(
      `[roomCreationForm] server response of room creation request ${JSON.stringify(
        result
      )}`
    );
    const { roomId, msg } = result;
    if (roomId) {
      UPDATE_TEXT(descDiv, "");
    } else {
      UPDATE_TEXT(descDiv, `${msg}`);
    }
  };
  frame.replaceChildren(fieldRoomName, button, descDiv);

  return {
    frame,
    whenCreateRoomRequest,
    roomCreationResponse,
  };
};

const getLineUpDiv = (clientGame) => {
  const frame = newDivTag();

  const roomNumDiv = newDivTag();

  const leaveButton = newButton({ desc: "leave room" });

  leaveButton.addEventListener("click", () => {
    clientGame.iWantToLeaveRoom();
  });
  const iAmInRoom = (roomId) => {
    UPDATE_TEXT(roomNumDiv, roomId);
  };

  const roomLineUpIs = (lu) => {
    console.log(`[getLineUpDiv roomLineUpIs] ${lu}`);
  };

  frame.replaceChildren(roomNumDiv, leaveButton);
  return {
    frame,
    iAmInRoom,
    roomLineUpIs,
  };
};

const getRoomDoor = (clientGame, { id, name, creatorName }) => {
  const frame = newDivTag();
  frame.style.border = "2px solid black";
  const divId = newDivTag(id);
  const divName = newDivTag(name);
  const divCreatorName = newDivTag(creatorName);
  [divId, divName, divCreatorName].forEach(
    (ele) => (ele.style.border = "1px solid black")
  );

  const detach = () => {
    frame.parentElement.removeChild(frame);
  };
  frame.replaceChildren(divId, divName, divCreatorName);
  return {
    frame,
    detach,
  };
};

const getActiveRooms = (clientGame) => {
  const frame = newDivTag();
  const rooms = {};

  const init = () => {
    console.log(`[getActiveRooms init]`);
    clientGame.canIHaveAllRooms().then((roomsData) => {
      console.log(`[getActiveRooms canIHaveAllRooms] Server returns`);
      console.log(roomsData);

      for (const roomData of roomsData) {
        const { id } = roomData;
        const activeRoom = getRoomDoor(clientGame, roomData);
        rooms[id] = activeRoom;
      }
      for (const [_, { frame: _roomframe }] of Object.entries(rooms)) {
        frame.appendChild(_roomframe);
      }
    });
  };

  clientGame.onRoomDeleted((whichId) => {
    console.log(`Active rooms. Room ${whichId} was removed by server`);
    rooms[whichId]?.detach();
  });
  init();
  return {
    frame,
  };
};
const getLobbyPage = (clientGame) => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationFormRequestDiv = getroomCreationFormRequestDiv();
  const activeRooms = getActiveRooms(clientGame);

  const lineUpDiv = getLineUpDiv(clientGame);

  const iAmInRoom = (roomId) => {
    if (roomId) {
      clientGame.whenLineUpChanges(lineUpDiv.roomLineUpIs);
      // tell room
      lineUpDiv.iAmInRoom(roomId);
      clientGame.whatIsTheLineUp(lineUpDiv.roomLineUpIs);
      // show room
      mainFrame.replaceChildren(lineUpDiv.frame);
    } else {
      mainFrame.replaceChildren(
        roomCreationFormRequestDiv.frame,
        activeRooms.frame
      );
    }
  };
  clientGame.whenIchangeRoom(iAmInRoom);

  return {
    frame: mainFrame,
    iAmInRoom,
    roomCreationResponse: (fn) =>
      roomCreationFormRequestDiv.roomCreationResponse(fn),
    whenCreateRoomRequest: (fn) =>
      roomCreationFormRequestDiv.whenCreateRoomRequest(fn),
  };
};

export default getLobbyPage;

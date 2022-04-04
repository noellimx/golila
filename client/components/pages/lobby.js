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

const getActiveRoomDiv = () => {
  const frame = newDivTag();

  const iAmInRoom = (roomId) => {
    UPDATE_TEXT(frame, roomId);
  };

  const roomLineUpIs = (lu) => {
    console.log(`[activeRoom roomLineUpIs] ${lu}`);
  };
  return {
    frame,
    iAmInRoom,
    roomLineUpIs,
  };
};
const getLobbyPage = (clientGame) => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationFormRequestDiv = getroomCreationFormRequestDiv();

  const lineUpDiv = getActiveRoomDiv();

  clientGame.whenIchangeRoom(iAmInRoom);

  const iAmInRoom = (roomId) => {
    if (roomId) {
      clientGame.whenLineUpChanges(lineUpDiv.roomLineUpIs);
      // tell room
      lineUpDiv.iAmInRoom(roomId);
      clientGame.whatIsTheLineUp(lineUpDiv.roomLineUpIs);
      // show room
      mainFrame.replaceChildren(lineUpDiv.frame);
    } else {
      mainFrame.replaceChildren(roomCreationFormRequestDiv.frame);
    }
  };

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

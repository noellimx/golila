import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS } from "../helpers.js";

const getRoomCreationRequestDiv = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "frame-room-create");
  const fieldRoomName = newTextInput();
  const button = newButton();

  let onCreateRoomRequest = NO_OP;
  button.addEventListener("click", () => {
    console.log(`[button create room onclick] `);
    const roomName = fieldRoomName.value;
    onCreateRoomRequest(roomName);
  });

  const whenCreateRoomRequest = (fn) => {
    onCreateRoomRequest = fn;
  };
  frame.replaceChildren(fieldRoomName, button);

  return {
    frame,
    whenCreateRoomRequest,
  };
};

const getLobbyPage = () => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationRequestDiv = getRoomCreationRequestDiv();

  const iAmInRoom = (roomId) => {
    if (roomId) {
    } else {
      mainFrame.replaceChildren(roomCreationRequestDiv.frame);
    }
  };
  return {
    frame: mainFrame,
    iAmInRoom,
    whenCreateRoomRequest: (fn) =>
      roomCreationRequestDiv.whenCreateRoomRequest(fn),
  };
};

export default getLobbyPage;

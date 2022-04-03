import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS, UPDATE_TEXT } from "../helpers.js";

const getRoomCreationRequestDiv = () => {
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

  const roomCreation = (result) => {
    console.log(`roomCreation ${JSON.stringify(result)}`);
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
    roomCreation,
  };
};

const getLobbyPage = (clientGame) => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationRequestDiv = getRoomCreationRequestDiv();

  const iAmInRoom = (roomId) => {
    if (roomId) {
      const roomDiv = newDivTag(roomId);

      mainFrame.replaceChildren(roomDiv);
    } else {
      mainFrame.replaceChildren(roomCreationRequestDiv.frame);
    }
  };

  return {
    frame: mainFrame,
    iAmInRoom,
    roomCreation: (fn) => roomCreationRequestDiv.roomCreation(fn),
    whenCreateRoomRequest: (fn) =>
      roomCreationRequestDiv.whenCreateRoomRequest(fn),
  };
};

export default getLobbyPage;

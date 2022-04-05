import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS, UPDATE_TEXT, DETACH } from "../helpers.js";

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

const getListLineUp = () => {
  const frame = newDivTag();

  const updateLineUp = (lineup) => {
    console.log(`[updateLineUp] `);
    console.log(lineup);
    const divs = lineup
      ? lineup.map(({ participantId, teamNo, participantName }) => {
          const pwrap = newDivTag();
          const divPID = newDivTag(participantName);
          const divTeamNo = newDivTag(teamNo);
          pwrap.replaceChildren(divPID, divTeamNo);

          return pwrap;
        })
      : [];

    frame.replaceChildren(...divs);
  };
  return {
    frame,
    updateLineUp,
  };
};

const getLineUpDiv = (clientGame) => {
  let roomId;
  const frame = newDivTag();

  const roomNumDiv = newDivTag();
  const list = getListLineUp();

  const leaveButton = newButton({ desc: "leave room" });

  leaveButton.addEventListener("click", () => {
    clientGame.iWantToLeaveRoom();
  });

  const changeTeamButton = newButton({ desc: "change team" });
  changeTeamButton.addEventListener("click", () => {
    clientGame.iWantToChangeTeam();
  });

  const startGameButton = newButton({ desc: "start" });
  startGameButton.addEventListener("click", () => {
    clientGame.startGame();
  });

  


  clientGame.onGameStarted(() => {
    DETACH(startGameButton);
    DETACH(changeTeamButton);
  });

  const iAmInRoom = (id) => {
    roomId = id;
    UPDATE_TEXT(roomNumDiv, roomId);
    frame.replaceChildren(roomNumDiv, list.frame, leaveButton);

    clientGame.amICreator(roomId, (isC) => {
      clientGame.isGameStarted((isGS) => {;;
;;;;;;;;
        console.log(`[iAmInRoom] ${roomId} amIcreator ${isC} isGameStarted ${isGS} `)
        isC && !isGS && frame.appendChild(startGameButton);
        !isGS && frame.appendChild(changeTeamButton)
      });;;
    });
  };

  const lineUpIs = (lu) => {
    console.log(
      `[getLineUpDiv roomLineUpIs]  native room ${roomId}       retrived     ${lu}`
    );
    if (lu) {
      const [_, lineup] = lu;
      list.updateLineUp(lineup);
    } else {
      list.updateLineUp(null);
    }
  };


  const init = () => {
 
    clientGame.whenLineUpChanges(lineUpIs);
    clientGame.whatIsTheLineUp().then(lineUpIs);

 

  }


  init()



  return {
    frame,
    iAmInRoom,
    lineUpIs,
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
    console.log(`[RoomDoor] Detaching room ${id}`);
    frame.parentElement?.removeChild(frame);
  };

  frame.addEventListener("click", () => {
    clientGame.iWantToJoinRoom(id);
  });
  frame.replaceChildren(divId, divName, divCreatorName);
  return {
    frame,
    detach,

    getId: () => id,
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
      console.log(`[getActiveRooms init appending] frames`);

      for (const [_, { frame: _roomframe }] of Object.entries(rooms)) {
        frame.appendChild(_roomframe);
      }
    });
  };
  clientGame.onRoomDeleted((whichId) => {
    console.log(
      `[Active rooms room deleted] Room ${whichId} was removed by server`
    );
    rooms[whichId]?.detach();
  });

  clientGame.onRoomStarted((whichId) => {
    console.log(
      `[Active rooms room started] Room ${whichId} was started by server.`
    );
    console.log(whichId);
    rooms[whichId]?.detach();
  });

  clientGame.onRoomCreated((whichId) => {
    console.log(`Active rooms. Room ${whichId} was created by server`);
    clientGame.getRoomData(whichId).then((data) => {
      console.log(`Active rooms. ${whichId === data.id}`);
      console.log(`Active rooms. data retrieved ${JSON.stringify(data)}`);
      rooms[data.id] = rooms[data.id] ?? getRoomDoor(clientGame, data);
      frame.appendChild(rooms[data.id].frame);
    });
  });

  init();
  return {
    frame,
  };
};
const getFieldCoin = (coin = "99") => {
  const frame = newDivTag(coin);

  const detach = () => {
    DETACH(frame);
  };

  const getToken = () => {
    return coin;
  };
  return {
    frame,
    detach,
    getToken,
  };
};

const getFieldChain = () => {
  const frame = newDivTag();

  const chainContainer = [];

  const reset = () => {
    chainContainer.forEach((fieldcoin) => {
      fieldcoin.detach();
    });
  };

  const consume = (token) => {
    if (!token) {
      return;
    }
    if (token === "-") {
      const last = chainContainer.pop();
      last?.detach();
      return;
    }
    const fieldcoin = getFieldCoin(token);
    chainContainer.push(fieldcoin);
    frame.appendChild(fieldcoin.frame);
  };
  const getTokenString = () => {
    const tokens = chainContainer
      .map((fc) => {
        return fc.getToken();
      })
      .join(",");
    return tokens;
  };
  return { frame, reset, consume, getTokenString };
};

const getTargetChain = () => {
  const frame = newDivTag();

  const div = newDivTag();

  frame.appendChild(div);
  const updateChain = (chain) => {
    UPDATE_TEXT(div, chain);
  };

  return { frame, updateChain };
};
const getBoard = (clientGame) => {
  const frame = newDivTag();
  ADD_CLASS(frame, "board");

  const lineUpDiv = getLineUpDiv(clientGame);

  const iAmInRoom = (roomId) => {
    if (!roomId) {
      DETACH(frame);
    }
    lineUpDiv.iAmInRoom(roomId);
  };

  const init = () => {
    frame.appendChild(lineUpDiv.frame);
  };

  const targetChain = getTargetChain();
  const fieldChain = getFieldChain();

  clientGame.onGameStarted(() => {
    clientGame.onCountDown((sec) => {
      console.log(`[Board onCountDown] ${sec}`);
    });

    clientGame.onNewChain((chain) => {
      console.log(`[Board onNewChain] ${chain}`);
      targetChain.updateChain(chain);
      frame.appendChild(targetChain.frame, fieldChain.frame);

      fieldChain.reset();
    });
    const KEYCODE_TO_TOKEN = (keycode) => {
      switch (keycode) {
        case "KeyJ":
          return "38";
        case "KeyK":
          return "39";
        case "KeyL":
          return "40";
        case "Backspace":
          return "-";
        default:
          return null;
      }
    };
    document.addEventListener("keydown", ({ code }) => {
      const token = KEYCODE_TO_TOKEN(code);
      fieldChain.consume(token);

      console.log(`[keydown] after := ${fieldChain.getTokenString()}`);
    });
  });

  init();
  return {
    frame,
    iAmInRoom,
  };
};
const getLobbyPage = (clientGame) => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationFormRequestDiv = getroomCreationFormRequestDiv();
  const activeRooms = getActiveRooms(clientGame);
  const board = getBoard(clientGame);

  const iAmInRoom = (roomId) => {
    // tell room anyway

    if (roomId) {
      board.iAmInRoom(roomId);
      // show room
      mainFrame.replaceChildren(board.frame);
    } else {;;
      mainFrame.replaceChildren(
        roomCreationFormRequestDiv.frame,
        activeRooms.frame
      );;;;;
    }
  };

  clientGame.whichRoomAmI().then((roomId) => {
    console.log(
      `[Lobby] Server responded: ${roomId ?? ""}`
    );
    iAmInRoom(roomId);
  });

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

import { newTextInput, newDivTag, newButton } from "../elements/index.js";
import { NO_OP, ADD_CLASS, UPDATE_TEXT, DETACH } from "../helpers.js";

import "./lobby.css";
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


const _getRollCall = (teamNo) => {
  const frame = newDivTag()

  ADD_CLASS(frame,"roll-call-frame")
  const headerDiv = newDivTag(teamNo)
  ADD_CLASS(headerDiv, `roll-call-team-no-${teamNo}`)

  const update = (lineup) => {

      const _lineup = [...lineup]

    _lineup.sort((a,b) => a?.participantName.localeCompare(b?.participantName))

    const divs = _lineup
      ? lineup.map(({ participantName }) => {
        const divPID = newDivTag(participantName);
        ADD_CLASS(divPID, `roll-call-team-${teamNo}`)

        return divPID;
      })
      : [];

    frame.replaceChildren(headerDiv, ...divs)
  }

  return {
    frame, update
  }
}

const getListLineUp = () => {
  const frame = newDivTag();

  ADD_CLASS(frame,"list-line-up")
  const bigdiv = newDivTag()
  // HACK
  const team1div = _getRollCall(1)
  const team2div = _getRollCall(2)

  const updateLineUp = (lineup) => {
    console.log(`[updateLineUp] `);
    console.log(lineup);


    // HACK
    const _team1 = lineup ? lineup.filter(({ teamNo }) => teamNo === 1) : []
    const _team2 = lineup ? lineup.filter(({ teamNo }) => teamNo === 2) : []

    // HACK
    team1div.update(_team1)
    team2div.update(_team2)

    frame.replaceChildren(team1div.frame,team2div.frame);
  };

  const detach = () => {
    DETACH(frame)
  }

  return {
    frame,
    updateLineUp,detach
  };
};

const getLineUp = (clientGame) => {
  let roomId;
  const frame = newDivTag();

  ADD_CLASS(frame, "line-up-frame");

  const roomDescDiv = newDivTag();
  ADD_CLASS(roomDescDiv, "line-up-room-id");

  const creatorDiv = newDivTag()
  ADD_CLASS(creatorDiv, "line-up-creator");

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

  [leaveButton,startGameButton,changeTeamButton].forEach(e => ADD_CLASS(e,"line-up-btn"));
  [changeTeamButton, startGameButton].forEach(e => ADD_CLASS(e,"line-up-btn-in"))

  ADD_CLASS(leaveButton,"line-up-btn-out")
  clientGame.onGameStarted(() => {
    DETACH(startGameButton);
    DETACH(changeTeamButton);
  });

  

  const iAmInRoom = (roomId,creatorName, roomName) => {
    console.log(`[LineUp iAmInRoom] rId ${roomId} rN ${roomName
} creatorName ${creatorName
}  `)
    const _rName = roomName ? roomName.length > 6 ? `${roomName.slice(0, 6)}...` : roomName : '';
    UPDATE_TEXT(roomDescDiv, `#${roomId} (${_rName})`);
    UPDATE_TEXT(creatorDiv, `Host: ${creatorName}`);

    frame.replaceChildren(roomDescDiv, creatorDiv, list.frame);

    clientGame.amICreator(roomId, (isC) => {
      clientGame.isGameStarted((isGS) => {
        console.log(
          `[LineUp iAmInRoom] ${roomId} amIcreator ${isC} isGameStarted ${isGS} `
        );

        list.detach();
        DETACH(leaveButton);
        isC && !isGS && frame.appendChild(startGameButton);
        !isGS && frame.appendChild(changeTeamButton);
        frame.appendChild(leaveButton)
        frame.appendChild(list.frame)
      });
    });
  };

  clientGame.onGameEnd(() => {
    console.log(`[Line Up] onGameEnd`);

    clientGame.whichRoomAmI(iAmInRoom);
  });

  const lineUpIs = (lu) => {
    console.log(
      `[getLineUpDiv roomLineUpIs]  native room ${roomId}       retrived     ${lu}`
    );
    if (lu) {
      const [_, lineup] = lu;
      list.updateLineUp(lineup);
    } else {
      list.updateLineUp([]);
    }
  };

  const init = () => {

    clientGame.whenLineUpChanges(lineUpIs);
    clientGame.whatIsTheLineUp().then(lineUpIs);
  };

  init();

  return {
    frame,
    iAmInRoom,
    lineUpIs,
  };
}; // get line up div

const getRoomDoor = (clientGame, { id, name, creatorName }) => {
  const frame = newDivTag();
  frame.style.border = "2px solid black";

  if (name.length > 6) {
    name = `${name.slice(0, 6)}...`;
  }
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
  ADD_CLASS(frame, "field-chain");
  const chainContainer = [];

  const reset = () => {
    chainContainer.forEach((fieldcoin) => {
      fieldcoin.detach();
    });

    chainContainer.splice(0, chainContainer.length);
  };

  let onchainchangefn = NO_OP;
  const onChainChange = (fn) => {
    onchainchangefn = fn;
  };

  const getTokenString = () => {
    const tokens = chainContainer
      .map((fc) => {
        return fc.getToken();
      })
      .join(",");
    return tokens;
  };

  const consume = (token) => {
    if (!token) {
      return;
    }
    if (token === "-") {
      const last = chainContainer.pop();
      last?.detach();
    } else {
      const fieldcoin = getFieldCoin(token);
      chainContainer.push(fieldcoin);
      frame.appendChild(fieldcoin.frame);
    }

    onchainchangefn(getTokenString());
  };

  return { frame, reset, consume, getTokenString, onChainChange };
};

const getTargetChain = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "target-chain-frame");

  const div = newDivTag();
  ADD_CLASS(div, "target-chain-display");

  frame.appendChild(div);
  const updateChain = (chain) => {
    console.log(`[Target Chain] uppdateChain`);
    // TODO
    UPDATE_TEXT(div, chain ?? "");
  };

  const reset = () => {
    updateChain();
  };

  return { frame, updateChain, reset };
}; // END OF TARGET CHAIN

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

const getTimer = (clientGame) => {
  const frame = newDivTag();

  const desc = newDivTag();
  ADD_CLASS(desc, "timer");
  const update = (ms) => {
    //  HACK
    console.log(`[Timer] update text $= ${ms}`);
    if (ms) {
      UPDATE_TEXT(desc, ms);
    } else {
      UPDATE_TEXT(desc, "");
    }
  };

  const detach = () => {
    DETACH(frame);
  };

  const reset = () => {
    UPDATE_TEXT(desc, "");
  };
  frame.appendChild(desc);
  return {
    frame,
    update,
    detach,
    reset,
  };
};

const getBoard = (clientGame) => {
  const frame = newDivTag();
  ADD_CLASS(frame, "board");




  const lineUpDiv = getLineUp(clientGame);

  const targetChain = getTargetChain();
  const fieldChain = getFieldChain();
  const iAmInRoom = (roomId, creatorName, roomName) => {
    console.log(`[Board i am in room] := creator ${creatorName}`)
    fieldChain.reset();
    lineUpDiv.iAmInRoom(roomId, creatorName, roomName);

    if (!roomId) {
      DETACH(frame);
      return;
    }
    refresh();
  };
  const timer = getTimer();

  const oncdLn = (sec) => {
    console.log(`[Board onCountDown] ${sec}`);
  };
  const onchainscoredLn = (scorer) => {
    console.log(`[onChainScored] ${scorer} scored!`);
  };
  const keydownLn = ({ code }) => {
    const token = KEYCODE_TO_TOKEN(code);
    fieldChain.consume(token);

    const chainString = fieldChain.getTokenString();
    console.log(`[keydown] after := ${chainString}`);

    fieldChain.onChainChange(clientGame.submitChain);
  };
  const onnewchainLn = (chain) => {
    console.log(`[Board onNewChain] ${chain}`);
    targetChain.updateChain(chain);
    frame.appendChild(targetChain.frame);
    frame.appendChild(fieldChain.frame);

    fieldChain.reset();
  };

  // HACK
  let interv;

  const startedPlane = () => {
    console.log(`[startedPlane] `);
    clientGame.onCountDown(oncdLn);
    clientGame.onNewChain(onnewchainLn);
    clientGame.onChainScored(onchainscoredLn);
    console.log(`[Board ] adding listener`);
    document.addEventListener("keydown", keydownLn);
    clientGame.whatIsMyChain().then(onnewchainLn);

    clearInterval(interv);
    interv = setInterval(() => {
      clientGame.howLongMoreMs().then((ms) => {
        timer.update(ms);
      });
    }, 1000);
    clientGame.onGameEnd(() => {
      console.log(`[Board] onGameEnd`);
      clearInterval(interv);
      timer.detach();
      targetChain.reset();

      clientGame.canIHaveTally().then((tally) => {});
    });

    frame.appendChild(timer.frame);
  };
  const dormantPlane = () => {
    console.log(`[dormantPlane]`);
    clearInterval(interv);

    // TODO Client side tear down if game is not in progress.
    clientGame.removeCountDown(oncdLn);
    // clientGame.removeOnNewChain(onnewchainLn);
    // clientGame.removeOnChainScored(onchainscoredLn)
    // asdfasdf;
    targetChain.reset();
    timer.reset();

    document.removeEventListener("keydown", keydownLn);
  };
  const refresh = () => {
    console.log(`[Board refresh] targetChain display reset`);
    targetChain.reset();
    clientGame.isGameStarted((is) => {
      console.log(`[Board refresh] clientGame.isGameStarted := ${is}`);
      if (is) {
        startedPlane();
      } else {
        dormantPlane();
      }
    });
  };
  const init = () => {
    console.log("[Board init] line up div :v");
    console.log(lineUpDiv);
    frame.appendChild(lineUpDiv.frame);
    refresh();
    clientGame.onGameStarted(startedPlane);
  };
  init();
  return {
    frame,
    iAmInRoom,
    refresh,
  };
}; // End of Board

const getLobbyPage = (clientGame) => {
  const mainFrame = newDivTag();
  ADD_CLASS(mainFrame, "page-lobby");

  const roomCreationFormRequestDiv = getroomCreationFormRequestDiv();
  const activeRooms = getActiveRooms(clientGame);
  const board = getBoard(clientGame);

  const iAmInRoom = (roomId,creatorName,roomName) => {

    console.log(`[Lobby iAmInRoom] cN ${creatorName}`)
    // tell room anyway
    if (roomId) {
      board.iAmInRoom(roomId, creatorName, roomName);
      // show room
      mainFrame.replaceChildren(board.frame);
    } else {
      mainFrame.replaceChildren(
        roomCreationFormRequestDiv.frame,
        activeRooms.frame
      );
    }

    board.refresh();


  };

  const refresh = () =>
    clientGame.whichRoomAmI(iAmInRoom);

  clientGame.whenIchangeRoom(iAmInRoom);
  refresh();
  return {
    frame: mainFrame,
    iAmInRoom,
    refresh,
    roomCreationResponse: (fn) =>
      roomCreationFormRequestDiv.roomCreationResponse(fn),
    whenCreateRoomRequest: (fn) =>
      roomCreationFormRequestDiv.whenCreateRoomRequest(fn),
  };
};

export default getLobbyPage;

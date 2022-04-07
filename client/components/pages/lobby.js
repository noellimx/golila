import {
  newTextInput,
  newDivTag,
  newButton,
  newImg,
  newTokenImg,
} from "../elements/index.js";
import {
  NO_OP,
  ADD_CLASS,
  UPDATE_TEXT,
  DETACH,
  REMOVE_CLASS,
} from "../helpers.js";

import "./lobby.css";

const getroomCreationFormRequestDiv = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "frame-room-create");

  // ELEMENT - fieldRoomName
  const fieldRoomName = newTextInput();
  ADD_CLASS(fieldRoomName, "frame-room-field");

  // ELEMENT - button

  const createAndJoinRoomButton = newButton();
  ADD_CLASS(createAndJoinRoomButton, "create-and-join-btn");

  UPDATE_TEXT(createAndJoinRoomButton, "+ and -> Room");

  let onCreateRoomRequest = NO_OP;
  createAndJoinRoomButton.addEventListener("click", () => {
    console.log(`[button create room onclick] `);
    const roomName = fieldRoomName.value;
    onCreateRoomRequest(roomName);
  });

  // ELEMENT - descript

  const descDiv = newDivTag();
  ADD_CLASS(descDiv, "desc-room-creation-form");

  const whenCreateRoomRequest = (fn) => {
    onCreateRoomRequest = fn;
  };

  let interv;

  const clearIntervalAndReset = () => {
    clearInterval(interv);
    UPDATE_TEXT(descDiv, "");
    REMOVE_CLASS(descDiv, "swiss-error");

    REMOVE_CLASS(descDiv, "invert-swiss-error");
  };

  const flash = (msg) => {
    clearIntervalAndReset();

    let flip = false;

    let count = 6;

    UPDATE_TEXT(descDiv, `${msg}`);
    interv = setInterval(() => {
      if (flip) {
        REMOVE_CLASS(descDiv, "invert-swiss-error");

        ADD_CLASS(descDiv, "swiss-error");
      } else {
        REMOVE_CLASS(descDiv, "swiss-error");
        ADD_CLASS(descDiv, "invert-swiss-error");
      }
      count -= 1;
      if (count < 0) {
        clearIntervalAndReset();
      }
      flip = !flip;
    }, 500);
  };

  const roomCreationResponse = (result) => {
    console.log(
      `[roomCreationForm] server response of room creation request ${JSON.stringify(
        result
      )}`
    );
    const { roomId, msg } = result;
    if (roomId) {
      clearIntervalAndReset();
    } else {
      flash(msg);
    }
  };
  frame.replaceChildren(fieldRoomName, createAndJoinRoomButton, descDiv);

  return {
    frame,
    whenCreateRoomRequest,
    roomCreationResponse,
  };
};

const fleetingDiamonds = (banana, bench) => {
  const frame = newDivTag(`+ ${banana}`);
  ADD_CLASS(frame, "fleeting-diamonds");

  bench.frame.appendChild(frame);

  const detach = () => {
    DETACH(frame);
  };

  setTimeout(detach, 5000);
  return {
    frame,
  };
};

const BONUS_SEE_SERVER = 50;

const newmembersBag = () => {
  const bag = {};

  return {
    set: (userId, bench) => {
      bag[userId] = bench;
      console.log(`adding ${userId}`);
      console.log(`bench v`);
      console.log(bench);
    },
    view: () => {
      console.log(`BAG`);
      console.log(bag);
    },
    showDiamonds: (tally) => {
      const { individuals, winningIndividuals } = tally;

      for (const { scorerId, credit } of individuals) {
        console.log(`fleeting ind ${scorerId} ${bag[scorerId]}`);
        // HACK

        bag[scorerId] && fleetingDiamonds(credit, bag[scorerId]);
      }

      for (const id of winningIndividuals) {
        console.log(`fleeting  winning ind ${id} ${bag[id]}`);

        // HACK

        bag[id] && fleetingDiamonds(BONUS_SEE_SERVER, bag[id]);
      }
    },
  };
};

const newBench = (pN, teamNo) => {
  const frame = newDivTag();

  ADD_CLASS(frame, `roll-call-team-${teamNo}`);

  const divPID = newDivTag(pN);
  // ADD_CLASS(divPID, `roll-call-team-${teamNo}`);
  frame.appendChild(divPID);

  return { frame };
};

const _getRollCall = (teamNo) => {
  const frame = newDivTag();

  ADD_CLASS(frame, "roll-call-frame");
  const headerDiv = newDivTag(teamNo);
  ADD_CLASS(headerDiv, `roll-call-team-no-${teamNo}`);

  const bag = newmembersBag();

  const update = (lineup) => {
    const _lineup = [...lineup];

    _lineup.sort((a, b) =>
      a?.participantName.localeCompare(b?.participantName)
    );

    const divs = _lineup
      ? lineup.map(({ participantName, participantId }) => {
          const bench = newBench(participantName, teamNo);

          bag.set(participantId, bench);
          return bench.frame;
        })
      : [];

    frame.replaceChildren(headerDiv, ...divs);

    bag.view();
  };

  const flashTally = (tally) => {
    bag.showDiamonds(tally);
  };

  return {
    frame,
    update,
    flashTally,
  };
}; // END OF ROLL CALL

const getListLineUp = () => {
  const frame = newDivTag();

  ADD_CLASS(frame, "list-line-up");
  const bigdiv = newDivTag();
  // HACK
  const team1div = _getRollCall(1);
  const team2div = _getRollCall(2);

  const updateLineUp = (lineup) => {
    console.log(`[updateLineUp] `);
    console.log(lineup);

    // HACK
    const _team1 = lineup ? lineup.filter(({ teamNo }) => teamNo === 1) : [];
    const _team2 = lineup ? lineup.filter(({ teamNo }) => teamNo === 2) : [];

    // HACK
    team1div.update(_team1);
    team2div.update(_team2);

    frame.replaceChildren(team1div.frame, team2div.frame);
  };

  const detach = () => {
    DETACH(frame);
  };

  const flashTally = (tally) => {
    team1div.flashTally(tally);
    team2div.flashTally(tally);
  };

  return {
    frame,
    updateLineUp,
    flashTally,
    detach,
  };
}; // END OF LIST LINE UP

const getLineUp = (clientGame) => {
  let roomId;
  const frame = newDivTag();

  ADD_CLASS(frame, "line-up-frame");

  const roomDescDiv = newDivTag();
  ADD_CLASS(roomDescDiv, "line-up-room-id");

  const creatorDiv = newDivTag();
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

  [leaveButton, startGameButton, changeTeamButton].forEach((e) =>
    ADD_CLASS(e, "line-up-btn")
  );
  [startGameButton].forEach((e) => ADD_CLASS(e, "line-up-btn-in"));

  ADD_CLASS(changeTeamButton, "line-up-btn-mid");
  ADD_CLASS(leaveButton, "line-up-btn-out");
  clientGame.onGameStarted(() => {
    DETACH(startGameButton);
    DETACH(changeTeamButton);
  });

  const iAmInRoom = (roomId, creatorName, roomName) => {
    console.log(
      `[LineUp iAmInRoom] rId ${roomId} rN ${roomName} creatorName ${creatorName}  `
    );
    // const _rName = roomName ? roomName.length > 6 ? `${roomName.slice(0, 6)}...` : roomName : '';
    const _rName = roomName;
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
        frame.appendChild(leaveButton);
        frame.appendChild(list.frame);
      });
    });
  };

  clientGame.onGameEnd(() => {
    console.log(`[Line Up] onGameEnd`);

    clientGame.whichRoomAmI(iAmInRoom);
  });
  let onmyteamchangeLn = NO_OP;
  const onMyTeamChange = (fn) => (onmyteamchangeLn = fn);
  const lineUpIs = (lu) => {
    console.log(
      `[getLineUpDiv roomLineUpIs]  native room ${roomId}       retrived     ${lu}`
    );
    if (lu) {
      const [_, lineup] = lu;

      clientGame.whatIsMyTeam().then(onmyteamchangeLn);
      list.updateLineUp(lineup);
    } else {
      list.updateLineUp([]);
    }
  };

  const flashTally = (tally) => {
    list.flashTally(tally);
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
    flashTally,
    onMyTeamChange,
  };
}; // get line up div

const getRoomDoor = (clientGame, { id, name, creatorName }) => {
  const frame = newDivTag();
  ADD_CLASS(frame, "door-frame");

  const divrId = newDivTag(`#${id}`);
  const divName = newDivTag(name);
  const divCreatorName = newDivTag(`Owner : ${creatorName}`);
  [divrId, divName, divCreatorName].forEach((ele) =>
    ADD_CLASS(ele, "door-element")
  );

  ADD_CLASS(divName, "door-element-heading");
  ADD_CLASS(divrId, "door-element-rid");
  ADD_CLASS(divrId, "door-element-heading");
  ADD_CLASS(divCreatorName, "door-element-user");

  const detach = () => {
    console.log(`[RoomDoor] Detaching room ${id}`);
    frame.parentElement?.removeChild(frame);
  };

  frame.addEventListener("click", () => {
    clientGame.iWantToJoinRoom(id);
  });

  const contentwrap = newDivTag();
  ADD_CLASS(contentwrap, "door-element-content-wrap");

  contentwrap.replaceChildren(divCreatorName, divrId);
  frame.replaceChildren(divName, contentwrap);

  return {
    frame,
    detach,

    getId: () => id,
  };
}; // END OF ROOM DOOR

const getJoinableRooms = (clientGame) => {
  const frame = newDivTag();
  ADD_CLASS(frame, "joinable-rooms");

  const rooms = {};

  const init = () => {
    console.log(`[getJoinableRooms init]`);
    clientGame.canIHaveJoinableRooms().then((roomsData) => {
      console.log(`[getJoinableRooms canIHaveJoinableRooms] Server returns`);
      console.log(roomsData);

      for (const roomData of roomsData) {
        const { id } = roomData;
        const activeRoom = getRoomDoor(clientGame, roomData);
        rooms[id] = activeRoom;
      }
      console.log(`[getJoinableRooms init appending] frames`);

      for (const [_, { frame: _roomframe }] of Object.entries(rooms)) {
        frame.appendChild(_roomframe);
      }
    });
  };
  clientGame.onRoomDeleted((whichId) => {
    console.log(
      `[Joinable Rooms room deleted] Room ${whichId} was removed by server`
    );
    rooms[whichId]?.detach();
  });

  clientGame.onRoomStarted((whichId) => {
    console.log(
      `[Joinable Rooms room started] Room ${whichId} was started by server.`
    );
    console.log(whichId);
    rooms[whichId]?.detach();
  });

  const showRoom = (whichId) => {
    console.log(`Joinable Rooms. Room ${whichId} was created by server`);
    clientGame.getRoomData(whichId).then((data) => {
      console.log(`Joinable Rooms. ${whichId === data.id}`);
      console.log(`Joinable Rooms. data retrieved ${JSON.stringify(data)}`);
      rooms[data.id] = rooms[data.id] ?? getRoomDoor(clientGame, data);
      frame.appendChild(rooms[data.id].frame);
    });
  };
  clientGame.onRoomCreated(showRoom);

  clientGame.onRoomNotStarted(showRoom);
  init();
  return {
    frame,
  };
};
const getFieldCoin = (token) => {
  const frame = newTokenImg(token, "a field token");

  const detach = () => {
    DETACH(frame);
  };

  const getToken = () => {
    return token;
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

  const myTeamChanged = (teamNo) => {
    if (teamNo === 1) {
      frame.style.borderBottom = `1px solid #6ac2d9`;
    } else if (teamNo === 2) {
      frame.style.borderBottom = `1px solid #fb7299`;
    } else {
      frame.style.borderBottom = `1px solid red`;
    }
  };
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

  return {
    frame,
    reset,
    consume,
    getTokenString,
    onChainChange,
    myTeamChanged,
  };
};

const getTargetChain = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "target-chain-frame");

  const div = newDivTag();
  ADD_CLASS(div, "target-chain-display");

  frame.appendChild(div);
  const updateChain = (chain) => {
    console.log(`[Target Chain] uppdateChain ?= ${chain}`);
    console.log({ s: chain });
    // TODO
    UPDATE_TEXT(div, chain ?? "");
    const tokens = chain
      ? chain.map((t) => {
          return newTokenImg(t);
        })
      : [];
    div.replaceChildren(...tokens);
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
  ADD_CLASS(frame, "timer-frame");

  const desc = newDivTag();
  ADD_CLASS(desc, "timer");
  const update = (ms) => {
    //  HACK
    console.log(`[Timer] update text $= ${ms}`);
    if (ms) {
      UPDATE_TEXT(desc, Math.floor(ms / 1000));
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

const newpopModal = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "model-scorer-pop");

  const show = (username) => {
    UPDATE_TEXT(frame, `💎  ${username} Scored  💎`);
    frame.style.display = "flex";
    ADD_CLASS(frame, "pop-scorer-fade-out");
  };
  const hide = () => {
    frame.style.display = "";
    REMOVE_CLASS(frame, "pop-scorer-fade-out");
  };
  return {
    frame,
    hide,
    show,
  };
};

const newcdModal = () => {
  const frame = newDivTag();
  ADD_CLASS(frame, "model-scorer-pop");

  const show = (sec) => {
    UPDATE_TEXT(frame, `Spawning in  ${sec} seconds!!`);
    frame.style.display = "flex";
    ADD_CLASS(frame, "pop-scorer-fade-out");
  };
  const hide = () => {
    frame.style.display = "";
    REMOVE_CLASS(frame, "pop-scorer-fade-out");
  };
  return {
    frame,
    hide,
    show,
  };
};
const getBoard = (clientGame) => {
  const frame = newDivTag();
  ADD_CLASS(frame, "board");

  const lineUpDiv = getLineUp(clientGame);

  const targetChain = getTargetChain();
  const fieldChain = getFieldChain();

  lineUpDiv.onMyTeamChange((teamNo) => fieldChain.myTeamChanged(teamNo));

  const iAmInRoom = (roomId, creatorName, roomName) => {
    console.log(`[Board i am in room] := creator ${creatorName}`);
    fieldChain.reset();
    lineUpDiv.iAmInRoom(roomId, creatorName, roomName);

    if (!roomId) {
      DETACH(frame);
      return;
    }
    refresh();
  };
  const timer = getTimer();

  const cdpop = newcdModal();

  let cdInterv;

  const resetCdInterv = () => {
    clearInterval(cdInterv);
    cdpop.hide();
  };
  // HACK
  const oncdLn = (sec) => {
    console.log(`[Board onCountDown] ${sec}`);

    resetCdInterv();

    if (sec - 1 === 0) return;
    cdpop.show(sec - 1);

    cdInterv = setTimeout(() => {
      resetCdInterv();
    }, 1100);
  };

  const scorerpop = newpopModal();

  let modalInterv;

  const resetModalInterv = () => {
    clearInterval(modalInterv);
    scorerpop.hide();
  };

  const onchainscoredLn = (scorer) => {
    console.log(`[onChainScored] ${scorer} scored!`);

    resetModalInterv();

    scorerpop.show(scorer);

    modalInterv = setTimeout(() => {
      resetModalInterv();
    }, 1500);
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

  const clearIntervalAndResetTimer = () => {
    clearInterval(interv);
    timer.detach();
    timer.reset();
  };

  const ongameendRcv = () => {
    console.log(`[Board] onGameEnd`);
    clearIntervalAndResetTimer();
    targetChain.reset();
    fieldChain.reset();
    // TODO
    clientGame.canIHaveTally().then((tally) => {
      console.log(`[canIHaveTally] <-v `);
      console.log(tally);
      lineUpDiv.flashTally(tally);
    });
    clientGame.removeOnGameEnd(ongameendRcv);
  }

  const startedPlane = () => {
    console.log(`[startedPlane] `);
    clientGame.onCountDown(oncdLn);
    clientGame.onNewChain(onnewchainLn);
    clientGame.onChainScored(onchainscoredLn);
    console.log(`[Board ] adding listener`);
    document.addEventListener("keydown", keydownLn);
    clientGame.whatIsMyChain().then(onnewchainLn);

    clearIntervalAndResetTimer();
    frame.appendChild(timer.frame);

    interv = setInterval(() => {
      clientGame.howLongMoreMs().then((ms) => {
        timer.update(ms);
      });
    }, 1000);
    clientGame.onGameEnd(ongameendRcv);
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
    frame.replaceChildren(scorerpop.frame, cdpop.frame, lineUpDiv.frame);
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
  const joinableRooms = getJoinableRooms(clientGame);

  const board = getBoard(clientGame);

  const iAmInRoom = (roomId, creatorName, roomName) => {
    console.log(`[Lobby iAmInRoom] cN ${creatorName}`);
    // tell room anyway
    if (roomId) {
      board.iAmInRoom(roomId, creatorName, roomName);
      // show room
      mainFrame.replaceChildren(board.frame);
    } else {
      mainFrame.replaceChildren(
        roomCreationFormRequestDiv.frame,
        joinableRooms.frame
      );
    }

    board.refresh();
  };

  const refresh = () => clientGame.whichRoomAmI(iAmInRoom);

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

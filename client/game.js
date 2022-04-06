import * as Cookies from "js-cookie";
import { NO_OP } from "./components/helpers.js";
const cookier = Cookies.default;

const ClientGame = (io) => {
  return ((Cookies) => {
    const whichRoomCb = (chanRecv) => {
      io.emit("which-room", (roomId, creatorName, roomName) => {
        console.log(`[whichRoomCb] <- roomId ${roomId}`);
        console.log(`[whichRoomCb] <- creatorName ${creatorName
          }`); console.log(`[whichRoomCb] <- creatorName ${roomName
            }`);

        chanRecv(roomId, creatorName, roomName);
      });
    };
    const whichRoomAmI = whichRoomCb

    const whenIchangeRoom = (fn) => {
      console.log(`whenIchangeRoom`);
      io.on("changed-room", () => {
        whichRoomCb(fn);
      });
    };

    const iWantToCreateAndJoinRoom = (roomName) => {
      console.log(`[iWantToCreateAndJoinRoom]`);
      return new Promise((resolve) => {
        io.emit("create-join-room", roomName, (response) => {
          console.log(
            `[iWantToCreateAndJoinRoom] create room request sent: ${roomName}`
          );
          resolve(response);
        });
      });
    };

    const iWantToJoinRoom = (roomId) => {
      console.log(`[iWantToJoinRoom]`);
      return new Promise((resolve) => {
        io.emit("join-room", roomId, (response) => {
          console.log(`[iWantToJoinRoom] join room request sent: ${roomId}`);
          resolve(response);
        });
      });
    };
    const whatIsTheLineUp = () => {
      console.log(`[whatIsTheLineUp]`);
      return new Promise((resolve) => {
        io.emit("line-up", (response) => {
          console.log(`[whatIsTheLineUp] := ${JSON.stringify(response)}`);
          console.log(response);
          resolve(response);
        });
      });
    };
    const whenLineUpChanges = (fn) => {
      io.on("line-up", () => {
        whatIsTheLineUp().then(fn);
      });
    };

    const iWantToLeaveRoom = () => {
      io.emit("leave-room");
    };

    const iWantToChangeTeam = () => {
      console.log(`[iWantToChangeTeam]`);
      io.emit("change-team");
    };

    const amICreator = (roomId, fn) => {
      io.emit("am-i-creator", roomId, fn);
    };

    const isGameStarted = (fn) => {
      io.emit("is-game-started", fn);
    };

    const canIHaveJoinableRooms = () => {
      return new Promise((resolve) => {
        io.emit("all-active-rooms", (rooms) => {
          resolve(rooms);
        });
      });
    };

    const getRoomData = (id) => {
      return new Promise((resolve) => {
        console.log(`[Client io emit room-data] ? ${id}`);
        io.emit("room-data", id, (roomData) => {
          resolve(roomData);
        });
      });
    };

    let onroomcreatedfn = NO_OP;

    const onRoomCreated = (fn) => {
      onroomcreatedfn = fn;
    };

    io.on("room-created", (id) => {
      console.log(`[room-created] room ${id}`);
      onroomcreatedfn(id);
    });


    let onroomnotstartedLn = NO_OP;

    const onRoomNotStarted = (fn) => {
      onroomnotstartedLn = fn;
    };

    io.on("room-not-started", (id) => {
      console.log(`[room-not-started] room ${id}`);
      onroomnotstartedLn(id);
    });



    let onroomdeletefn = NO_OP;
    const onRoomDeleted = (fn) => {
      onroomdeletefn = fn;
    };

    io.on("room-deleted", (id) => {
      console.log(`[room-deleted] room ${id} has been deleted`);
      onroomdeletefn(id);
    });

    const onRoomStarted = (fn) => {
      io.on("room-started", (id) => {
        console.log(`[room-started] room ${id} has start.`);
        fn(id);
      });
    };

    const startGame = () => {
      io.emit("start-game");
    };

    const onGameStarted = (fn) => {
      io.on("game-started", fn);
    };

    const eventCd = "game-started-count-down";
    const onCountDown = (fn) => {
      io.on(eventCd, fn);
    };

    const removeCountDown = (fn) => {
      io.off(eventCd, fn);
    };

    const whatIsMyChain = () => {
      return new Promise((resolve) => {
        io.emit("what-chain", (chain) => {
          resolve(chain);
        });
      });
    };

    const submitChain = (chainString) => {
      console.log(`[Client emit submitChain] -> ${chainString}`);
      io.emit("submit-chain", chainString);
    };

    const onNewChain = (fn) => {
      io.on("game-new-chain-notify", () => {
        whatIsMyChain().then(fn);
      });
    };

    const onGameEnd = (fn) => {
      io.on("game-ended", fn);
    };

    const canIHaveTally = () => {
      return new Promise((resolve) => {
        io.emit("can-i-have-tally", (tally) => {
          console.log(`[Client emit can-i-have-tally] <-`);
          console.log(tally);
          resolve(tally);
        });
      });
    };

    const submitTry = (attempt) => {
      io.on("game-submit", attempt);
    };

    const onChainScored = (fn) => {
      io.on("chain-hit-by", (scorer) => {
        fn(scorer);
      });
    };

    const howLongMoreMs = () => {
      return new Promise((resolve) => {
        io.emit("how-long-more", (ms) => {
          console.log(`[clientGame how long more] := ${ms}`);
          resolve(ms);
        });
      });
    };

    return {
      whichRoomAmI,
      iWantToCreateAndJoinRoom,
      howLongMoreMs,
      onChainScored,
      whatIsTheLineUp,
      whenLineUpChanges,
      whenIchangeRoom,
      iWantToLeaveRoom,
      canIHaveJoinableRooms,
      onRoomDeleted,
      onRoomCreated,
      getRoomData,
      iWantToJoinRoom,
      iWantToChangeTeam,
      amICreator,
      startGame,
      onGameStarted,
      onCountDown,
      onNewChain,
      onGameEnd,
      onRoomStarted,
      isGameStarted,
      submitTry,
      whatIsMyChain,
      canIHaveTally,
      submitChain,
      removeCountDown, onRoomNotStarted
    };
  })(cookier);
};

export default ClientGame;

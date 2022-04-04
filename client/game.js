import * as Cookies from "js-cookie";
import { NO_OP } from "./components/helpers.js";
const cookier = Cookies.default;

const ClientGame = (io) => {
  return ((Cookies) => {
    const whichRoomCb = (resolve) => {
      io.emit("which-room", (roomId) => {
        console.log(`[whichRoomCb] I am in ${roomId}`);

        resolve(roomId);
      });
    };
    const whichRoomAmI = () => {
      console.log(`[whichRoomAmI]`);

      return new Promise(whichRoomCb);
    };

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
    const whatIsTheLineUp = () => {
      console.log(`[whatIsTheLineUp]`);
      return new Promise((resolve) => {
        io.emit("line-up", (response) => {
          console.log(`[whatIsTheLineUp] := ${response}`);
          console.log(response);
          resolve(response);
        });
      });
    };

    const iWantToLeaveRoom = () => {
      io.emit("leave-room");
    };

    const whenLineUpChanges = (fn) => io.on("line-up", fn);

    const canIHaveAllRooms = () => {
      return new Promise((resolve) => {
        io.emit("all-active-rooms", (rooms) => {
          resolve(rooms);
        });
      });
    };
    let onroomdeletefn = NO_OP;
    const onRoomDeleted = (fn) => {
      onroomdeletefn = fn;
    };

    io.on("room-deleted", (id) => {
      console.log(`[room-deleted] room ${id} has been deleted`);
      onroomdeletefn(id);
    });
    return {
      whichRoomAmI,
      iWantToCreateAndJoinRoom,
      whatIsTheLineUp,
      whenLineUpChanges,
      whenIchangeRoom,
      iWantToLeaveRoom,
      canIHaveAllRooms,
      onRoomDeleted,
    };
  })(cookier);
};

export default ClientGame;

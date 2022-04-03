import * as Cookies from "js-cookie";
const cookier = Cookies.default;

const ClientGame = (io) => {
  return ((Cookies) => {
    const whichRoomAmI = () => {
      console.log(`[whichRoomAmI]`);

      return new Promise((resolve) => {
        io.emit("which-room", (roomId) => {
          console.log(`[whichRoomAmI] resolving ${roomId}`);

          resolve(roomId);
        });
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

    return {
      whichRoomAmI,
      iWantToCreateAndJoinRoom,
    };
  })(cookier);
};

export default ClientGame;

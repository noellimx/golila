import * as Cookies from "js-cookie";
const cookier = Cookies.default;

const ClientGame = (io) => {
  return ((Cookies) => {
    const whichRoomAmI = () => {
      return new Promise((resolve) => {
        io.emit("which-room", (roomId) => {
          resolve(roomId);
        });
      });
    };

    const iWantToCreateRoom = (roomName) => {
      console.log(`[iWantToCreateRoom]`);
      return new Promise((resolve) => {
        io.emit("create-room", roomName, (response) => {
          console.log(
            `[iWantToCreateRoom] create room request sent: ${roomName}`
          );

          resolve(response)
        });
      });
    };

    return {
      whichRoomAmI,
      iWantToCreateRoom,
    };
  })(cookier);
};

export default ClientGame;

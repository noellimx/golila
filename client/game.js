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
    const whatIsTheLineUp = () => {
      console.log(`[whatIsTheLineUp]`)
      return new Promise((resolve) => {
        io.emit("line-up", (response) => {
          console.log(
            `[whatIsTheLineUp] := ${response}`
          );
          console.log(response)
          resolve(response);
        });
      });
    }

    const whenLineUpChanges = (fn) => io.on("line-up", fn);


    return {
      whichRoomAmI,
      iWantToCreateAndJoinRoom, whatIsTheLineUp, whenLineUpChanges
    };
  })(cookier);
};

export default ClientGame;

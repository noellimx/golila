import "./root.css";

import getLoginPage from "./components/pages/unauthenticated.js";
import getLobbyPage from "./components/pages/lobby.js";
import ClientAuth from "./auth.js";
import ClientGame from "./game.js";
class Scene {
  toggleDisplayOnValidation = (is) => {
    if (is) {
      this.lobby();
    } else {
      this.loginPage();
      this.loginFrame.loginFailed(this.clientAuth.getStatus());
    }
  };
  constructor(io) {
    this.root = document.getElementById("root");

    this.clientAuth = new ClientAuth(io);
    this.clientGame = new ClientGame(io);

    this.loginFrame = getLoginPage();

    this.loginFrame.whenLoginRequest((username, password) => {
      this.clientAuth.hiServerIsMyCredentialsValid(
        { username, password },
        this.toggleDisplayOnValidation
      );
    });

    this.lobbyFrame = getLobbyPage();

    this.lobbyFrame.whenCreateRoomRequest((roomName) => {
      console.log(`[whenCreateRoomRequest] ${roomName}`);
      this.clientGame.iWantToCreateRoom(roomName).then((response) => {
        this.lobbyFrame.roomCreation(response);
        this.commence();
      });
    });
  }

  commence() {
    this.clientAuth.hiServerIsMyTokenValid((is) => {
      if (is) {
        this.lobby();
      } else {
        this.loginPage();
      }
    });
  }
  loginPage() {
    console.log("[loginPage] flashing");
    this.root.replaceChildren(this.loginFrame.frame);
  }
  lobby() {
    console.log("[lobby] flashing");

    this.clientGame.whichRoomAmI().then((roomId) => {
      console.log(
        `[Scene lobby whichRoomAmI] Server responded: ${roomId ?? ""}`
      );
      this.lobbyFrame.iAmInRoom(roomId);
    });

    this.root.replaceChildren(this.lobbyFrame.frame);
  }
}

export default Scene;

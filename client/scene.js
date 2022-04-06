import "./root.css";

import getLoginPage from "./components/pages/unauthenticated.js";
import getLobbyPage from "./components/pages/lobby.js";
import getNavBar from "./components/frames/navbar.js";

import ClientAuth from "./auth.js";
import ClientGame from "./game.js";
import ClientUser from "./user.js";

import { ADD_CLASS } from "./components/helpers.js";
class Scene {
  serverValidatesCredential = (is) => {
    if (is) {
      window.location.reload(); // IMPORTANT. new HTTP connection to tompang cookies.;;
    } else {
      this.loginPage();
      this.loginFrame.loginFailed(this.clientAuth.getStatus());
    }
  };
  constructor(io) {
    this.root = document.getElementById("root");
    ADD_CLASS(this.root, "root-frame");
    this.clientAuth = new ClientAuth(io);
    this.clientGame = new ClientGame(io);
    this.clientUser = new ClientUser(io);

    this.loginFrame = getLoginPage();

    this.navbar = getNavBar(this.clientAuth, this.clientUser);

    this.loginFrame.whenLoginRequest((username, password) => {
      this.clientAuth.hiServerIsMyCredentialsValid(
        { username, password },
        (is) => {
          console.log(
            `[loginFrame.whenLoginRequest] My Token ${this.clientAuth.getAuthToken()}`
          );
          console.log(`[loginFrame.whenLoginRequest] Server replied ${is}`);
          this.serverValidatesCredential(is);
        }
      );
    });

    this.loginFrame.whenRegisterRequest((username, password, password2) => {
      this.clientAuth.hiServerCanIRegister(
        { username, password, password2 },
        ([createdUser, msg]) => {
          console.log(
            `[loginFrame.whenRegisterRequest] := user ${createdUser}, ${msg}`
          );
          this.loginFrame.registrationResponse([createdUser, msg]);
        }
      );
    });

    this.lobbyFrame = getLobbyPage(this.clientGame);

    this.lobbyFrame.whenCreateRoomRequest((roomName) => {
      console.log(`[whenCreateRoomRequest] ${roomName}`);
      this.clientGame.iWantToCreateAndJoinRoom(roomName).then((response) => {
        this.lobbyFrame.roomCreationResponse(response);
        this.commence();
      });
    });

    this.clientAuth.whenLoggedOut(() => {
      window.location.reload(); // IMPORTANT. new HTTP connection to tompang cookies.;;
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
    console.log("[loginPage] i am in login page");
    this.root.replaceChildren(this.loginFrame.frame);
  }
  lobby() {
    console.log("[lobby] i am in lobby");
    this.lobbyFrame.refresh();
    this.root.replaceChildren(this.navbar.frame, this.lobbyFrame.frame);
  }
}

export default Scene;

import "./root.css";

import loginFrame from "./components/pages/unauthenticated.js";
import clientAuth from "./auth.js";

class Scene {
  constructor(io) {
    this.root = document.getElementById("root");
    this.loginFrame = loginFrame;

    this.loginFrame.whenLoginRequest((username, password) => {
      io.emit("login-request", { username, password }, (_authResponse) => {
        console.log(_authResponse);
        const authResponse = _authResponse;
        clientAuth.setAuth(authResponse);

        if (clientAuth.hasToken()) {
          this.lobby();
        } else {
          this.loginFrame.loginFailed(clientAuth.getStatus());
        }
      });
    });

    io.on("client-token", (data) => {
      const { securityToken } = data;

      clientAuth.setAuth(securityToken);

      if (clientAuth.hasToken()) {
        this.lobby();
      } else {
        console.log("token not granted or revoked.");
      }
    });
  }

  commence() {
    this.root.appendChild(this.loginFrame.frame);
  }

  lobby() {
    const div = document.createElement("div");
    div.innerHTML = "lobby";
    this.root.replaceChildren(div);
  }
}

export default Scene;

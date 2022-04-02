import "./root.css";

import loginFrame from "./components/pages/unauthenticated.js";

class Scene {
  toggleDisplayOnValidation = (is) => {
    if (is) {
      this.lobby();
    } else {
      this.loginPage();
      this.loginFrame.loginFailed(this.clientAuth.getStatus());
    }
  };
  constructor(io, clientAuth) {
    this.root = document.getElementById("root");
    this.loginFrame = loginFrame;
    this.clientAuth = clientAuth;
    this.io = io;
    this.loginFrame.whenLoginRequest((username, password) => {
      this.clientAuth.hiServerIsMyCredentialsValid(
        { username, password },
        this.toggleDisplayOnValidation
      );
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
    this.root.replaceChildren(this.loginFrame.frame);
  }
  lobby() {
    const div = document.createElement("div");
    div.innerHTML = "lobby";
    this.root.replaceChildren(div);
  }
}

export default Scene;

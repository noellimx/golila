import "./root.css";

import loginFrame from "./components/pages/unauthenticated.js";
class Scene {
  constructor() {
    this.root = document.getElementById("root");
  }

  commence() {
    this.root.appendChild(loginFrame);
  }
}

export default new Scene();

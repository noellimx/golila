import { io as socketio } from "socket.io-client";

import scene from "./sceneCaster.js";
import clientAuth from "./auth.js";

const io = socketio();

io.on("client-token", (data) => {
  const { securityToken } = data;
  clientAuth.setAuth(securityToken);
});
scene.commence();

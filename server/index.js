import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { getSecurityToken, validateToken } from "./auth/auth.js";
import http from "http";

import { UserDoor } from "./auth/crypt.js";
const SERVER_LISTENING_PORT = 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server, { cookie: true }); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

bindRoutes(app);

const bindEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`[io.on connection] new socket connected ${socket.id}`);
    const cookie = socket.handshake.headers.cookie;

    socket.on("login-request", async (credentials, resCb) => {
      const { username, password } = credentials;
      console.log("[socket.on login - request] Getting security token. . . ");

      const { securityToken, msg } = await getSecurityToken({
        username,
        password,
      });

      console.log(
        `[socket.on login - request] securityToken ${securityToken} msg ${msg}`
      );
      resCb({ securityToken, msg });
    });

    socket.on("verify-token", async (securityToken, resCb) => {
      console.log(`[verify-token] Verifying ${securityToken}`);

      const { securityToken: validToken, msg } = await validateToken(
        securityToken
      );

      resCb({
        securityToken: validToken,
        msg,
      });
    });
  });
};

bindEvents(io);

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

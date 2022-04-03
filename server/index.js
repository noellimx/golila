import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { getSecurityToken, validateToken, decodeUserId } from "./auth/auth.js";
import http from "http";

import cookier from "cookie";

const SERVER_LISTENING_PORT = 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server, { cookie: true }); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

bindRoutes(app);

const _getCookies = (socket) => socket.handshake.headers.cookie;

const _getDbUserIdOfSocket = (socket) => {
  try {
    const cookieString = _getCookies(socket);
    console.log(`[_getDbUserIdOfSocket] cookieString ${cookieString
}`)
    const cookie = cookier.parse(cookieString);
    console.log(`[_getDbUserIdOfSocket] cookie ${JSON.stringify(cookie)
      }`)
    const concealedUser = cookie["s-token"];
    const userId = decodeUserId(concealedUser);
    return userId;
  }catch (err){
    console.log("[_getDbUserIdOfSocket] Error" + err)

    throw err;
  }
};
const bindSocketEvents = (socket) => {
  socket.on("login-request", async (credentials, resCb) => {
    const { username, password } = credentials;
    console.log("[socket.on login - request] Getting security token. . . ");

    const { securityToken, msg } = await getSecurityToken({
      username,
      password,
    });

    console.log(
      `[socket.on login - request] securityToken ${JSON.stringify(securityToken)} msg ${msg}`
    );
    resCb({ securityToken, msg });
  });

  socket.on("verify-token", async (securityToken, resCb) => {
    console.log(securityToken)
    console.log(`[verify-token] Verifying ${JSON.stringify(securityToken)}`);

    const { securityToken: validToken, msg } = await validateToken(
      securityToken
    );

    resCb({
      securityToken: validToken,
      msg,
    });
  });
  socket.on("which-room", async (cb) => {
    const userId = _getDbUserIdOfSocket(socket);

    cb(null);
  });

  socket.on("create-room", (roomName, cb) => {
    const userId = _getDbUserIdOfSocket(socket);

    console.log(
      `[create-room] ${userId} requesting to create room ${roomName}`
    );
    cb({
      roomId: null,
      msg: "No empty room name....",
    });
  });
};

const bindEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`[io.on connection] new socket connected ${socket.id}`);
    const cookie = socket.handshake.headers.cookie;
    bindSocketEvents(socket);
  });
};

bindEvents(io);

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

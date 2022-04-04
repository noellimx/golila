import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { getSecurityToken, validateToken, decodeUserId } from "./auth/auth.js";
import http from "http";
import {
  createAndJoinRoom,
  whichRoomIsUserIn, getLineUp
} from "./database/actions/game.js";
import cookier from "cookie";
import { seed } from "./database/api/seed.js";
const SERVER_LISTENING_PORT = 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

await seed(false);

bindRoutes(app);

const _getCookies = (socket) => socket.handshake.headers.cookie;

const _getDbUserIdOfSocket = (socket) => {
  try {
    const cookieString = _getCookies(socket);

    console.log(`[_getDbUserIdOfSocket] cookieString ${cookieString}`);
    const cookie = cookier.parse(cookieString);
    console.log(`[_getDbUserIdOfSocket] cookie ${JSON.stringify(cookie)}`);
    const concealedUser = cookie["s-token"];
    const userId = decodeUserId(concealedUser);
    return userId;
  } catch (err) {
    console.log("[_getDbUserIdOfSocket] Consumed Error" + err);
    return null;
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
      `[socket.on login - request] securityToken ${JSON.stringify(
        securityToken
      )} msg ${msg}`
    );
    resCb({ securityToken, msg });
  });

  socket.on("verify-token", async (securityToken, resCb) => {
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
    console.log("[which-room]");
    const userId = _getDbUserIdOfSocket(socket);
    const roomId = await whichRoomIsUserIn(userId);
    cb(roomId);
  });

  socket.on("create-join-room", async (roomName, cb) => {
    try {
      const userId = _getDbUserIdOfSocket(socket);

      console.log(
        `[create-join-room] ${userId} requesting to create and join room name ${roomName}`
      );
      const hostingRoomId = await createAndJoinRoom(userId, roomName);

      console.log(
        `[create-join-room] ${userId} completed create and join room id ${hostingRoomId}`
      );

      cb({
        roomId: hostingRoomId,
        msg: "ok",
      });
    } catch (err) {
      console.log(`[create-join-room] ${err
}`);
      cb({
        roomId: null,
        msg: `[Server Error io create-join-room] ${err}`,
      });
    }
  });


  socket.on("line-up", async (cb) => {
    console.log(`[Server io on line-up]`)
    const userId = _getDbUserIdOfSocket(socket);
    cb(await getLineUp(userId))
  })
};

const bindEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`[io.on connection] new socket connected ${socket.id}`);

    const cookie = socket.handshake.headers.cookie;
    console.log(`[io.on connection] cookie ${cookie}`);
    bindSocketEvents(socket);
  });
};

bindEvents(io);

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

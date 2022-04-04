import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { getSecurityToken, validateToken, decodeUserId } from "./auth/auth.js";
import http from "http";
import {
  createAndJoinRoom,
  whichRoomIsUserIn,
  getLineUp,
  leaveRoom,
  getAllRooms,
  getRoomData,
} from "./database/actions/game.js";
import cookier from "cookie";
import { seed } from "./database/api/seed.js";
import {
  getSocketsOfUsers,
  getSocketsOfUser,
  updateSession,
  removeSession,
} from "./database/api/session.js";
const SERVER_LISTENING_PORT = 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

await seed();

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
    const userId = _getDbUserIdOfSocket(socket);
    if (validToken) {
      await updateSession(socket.id, userId);
    } else {
      await removeSession(socket.id);
    }
    resCb({
      securityToken: validToken,
      msg,
    });
  });
  socket.on("which-room", async (cb) => {
    console.log("[which-room]");
    const userId = _getDbUserIdOfSocket(socket);

    console.log(`[which-room] user of socket is ${userId}`);

    const roomId = await whichRoomIsUserIn(userId);

    console.log(`[which-room] user of socket ${userId} is in room ${roomId}`);

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
      io.emit("room-created", hostingRoomId);
      const userSockets = await getSocketsOfUser(userId);
      console.log(`[create-join-room] userSockets`);
      console.log(`${userSockets}`);
      userSockets.forEach(({ id }) => {
        io.to(id).emit("changed-room");
      });
    } catch (err) {
      console.log(`[create-join-room] ${err}`);
      cb({
        roomId: null,
        msg: `[Server Error io create-join-room] ${err}`,
      });
    }
  });

  socket.on("line-up", async (cb) => {
    console.log(`[Server io on line-up]`);
    const userId = _getDbUserIdOfSocket(socket);
    cb(await getLineUp(userId));
  });

  socket.on("leave-room", async () => {
    const userId = _getDbUserIdOfSocket(socket);
    const [removedRoomId, leftPids] = await leaveRoom(userId);
    removedRoomId && io.emit("room-deleted", removedRoomId);

    const roomId = await whichRoomIsUserIn(userId);
    roomId === null;
    const userSockets = await getSocketsOfUsers(leftPids);
    console.log(`[Server on leave-room] ${JSON.stringify(userSockets)}`);

    userSockets.forEach(({ id }) => {
      io.to(id).emit("changed-room");
    });
  });

  socket.on("all-active-rooms", async (fn) => {
    const rooms = await getAllRooms();
    console.log(`[all-active-rooms] result v `);
    console.log(rooms);
    fn(rooms);
  });

  socket.on("room-data", async (id, fn) => {
    const data = await getRoomData(id);
    fn(data);
  });
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

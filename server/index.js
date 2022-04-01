import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { parse as parseCookie } from "cookie";

import http from "http";
const SERVER_LISTENING_PORT = 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server, { cookie: true }); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

bindRoutes(app);

const bindEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("new socket connected");
    const cookie = socket.handshake.headers.cookie;
    socket.handshake.headers.cookie = { ...parseCookie(cookie), froms: "aaa" };
    console.log("aa");

    socket.emit("client-token", { potato: "kontroller" });
  });
};

bindEvents(io);

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

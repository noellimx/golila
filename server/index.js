import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/http.js";
import { Server } from "socket.io";
import http from "http";

import bindEvents from "./routes/socketio.js";

const SERVER_LISTENING_PORT = process.env.PORT || 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server); // upgrade / mounting

app.use(express.static("dist"));
app.use(cookieParser());

// await seed();

bindRoutes(app);

bindEvents(io);

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

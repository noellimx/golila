import { io as socketio } from "socket.io-client";

const io = socketio("", { withCredentials: true});;

export default io;

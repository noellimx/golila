import io from "./connection/connection.js";
import ClientAuth from "./auth.js";

import Scene from "./scene.js";
const scene = new Scene(io, new ClientAuth(io));
scene.commence();

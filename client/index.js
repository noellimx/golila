import io from "./connection/connection.js";

import Scene from "./scene.js";

import { revv } from "./components/elements/index.js";
const scene = new Scene(io);
scene.commence();
revv();

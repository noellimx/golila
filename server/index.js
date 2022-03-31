import express from "express";
import bindRoutes from "./routes/routes.js";

const SERVER_LISTENING_PORT = 3004;
const app = express();

bindRoutes(app);

app.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

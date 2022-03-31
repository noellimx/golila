import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./routes/routes.js";

const SERVER_LISTENING_PORT = 3004;
const app = express();

app.use(express.static("dist"));
app.use(cookieParser());

bindRoutes(app);

app.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});

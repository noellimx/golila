import express from "express";
import bindRoutes from "./routes.js";

const app = express();

bindRoutes(app);

app.listen(3004);

import { resolve } from "path";

export default (app) => {
  app.get("/", (req, res) => {
    console.log(req.cookies);
    res.sendFile(resolve("dist", "main.html"));
  });
};

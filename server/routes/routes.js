import { resolve } from "path";

export default (app) => {
  app.get("/", (req, res) => {
    console.log(req.cookies);
    res.cookie("donotuse", "hehehehehe");
    res.sendFile(resolve("dist", "main.html"));
  });
};

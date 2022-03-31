import { resolve } from "path";

export default (app) => {
  app.get("/", (_, res) => {
    console.log();
    res.cookie("donotuse", "hehehehehe");
    res.sendFile(resolve("dist", "main.html"));
  });
};

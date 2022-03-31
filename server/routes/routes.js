import { resolve } from "path";

export default (app) => {
  app.get("/", (_, res) => {
    console.log(resolve("dist", "main.html"));
    res.cookie("donotuse", "hehehehehe");
    res.send("a");
  });
};

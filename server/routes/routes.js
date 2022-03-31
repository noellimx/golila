import { resolve } from "path";

export default function bindRoutes(app) {
  app.get("/", (request, response) => {
    console.log(resolve("dist", "main.html"));
    response.send("a");
  });
}

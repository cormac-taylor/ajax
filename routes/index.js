import apiRoutes from "./routesApi.js";
import { static as staticDir } from "express";

const constructorMethod = (app) => {
  app.use("/", apiRoutes);
  app.use("/public", staticDir("public"));

  app.use("*", (_, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;

const express = require("express");
const allRouters = require("../../data/router");

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send("Hello from API root!");
});
// add all routes
allRouters.forEach((router) => {
  rootRouter.use(router?.path, router?.router);
});

module.exports = rootRouter;

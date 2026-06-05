const express = require("express");
const statsRouter = express.Router();
const authMiddleware = require("../../middlewares/auth");
const { getUserStats } = require("./controller");

statsRouter.get("/user-stats", authMiddleware("user"), getUserStats);

module.exports = statsRouter;

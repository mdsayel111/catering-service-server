// routes/notificationRoutes.js
const express = require("express");
const { sendNotification, subscribe } = require("./controllers");

const notificationRouter = express.Router();

// notificationRouter.post("/register", registerToken);
// notificationRouter.post("/send", sendNotification);
notificationRouter.post("/subscribe", subscribe);
notificationRouter.post("/send", sendNotification);

notificationRouter.get("/telegram-notification", sendNotification);

module.exports = notificationRouter;

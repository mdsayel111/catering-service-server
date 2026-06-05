

const webpush = require("web-push");
const asyncErrorHandler = require("../../HOF/async-error-handler");
const config = require("../../config");
const { subscriptions } = require("../../data/notification");
const {
  sendNotification: sendPushNotification,
} = require("../../utils/notification");

const publicVapidKey = config?.vapidPublicKey;
const privateVapidKey = config?.vapidPrivateKey;

webpush.setVapidDetails(
  "mailto:you@example.com",
  publicVapidKey,
  privateVapidKey,
);

const subscribe = (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription received" });
};

const sendNotification = async (req, res) => {
  const { title, body, data } = req.body;
  await sendPushNotification(title, body, data);
  res.json({ success: true, message: "Notifications sent" });
};



module.exports = {
  subscribe: asyncErrorHandler(subscribe),
  sendNotification: asyncErrorHandler(sendNotification),
};

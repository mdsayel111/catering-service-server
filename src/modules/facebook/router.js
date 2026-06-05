const express = require("express");
const fetch = require("node-fetch");
const config = require("../../config");

const facebookRouter = express();
facebookRouter.use(express.json());

// Temporary storage for connected pages
let connectedPages = [];

facebookRouter.get("/callback", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = "http://localhost:5000/api/facebook/callback";

  try {
    // 1️⃣ Exchange code for short-lived user token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${config?.appId}&redirect_uri=${redirect_uri}&client_secret=${config?.appSecret}&code=${code}`,
    );
    const tokenData = await tokenRes.json();
    const userToken = tokenData.access_token;

    if (!userToken) return res.status(400).send("Failed to get user token");

    // 2️⃣ Fetch all pages user manages (including picture)
    const pagesRes = await fetch(
      `https://graph.facebook.com/v17.0/me/accounts?fields=id,name,access_token,picture{url}&access_token=${userToken}`,
    );
    const pagesData = await pagesRes.json();

    const pages = pagesData.data.map((p) => ({
      id: p.id,
      name: p.name,
      access_token: p.access_token,
      image: p.picture?.data?.url, // profile image URL
    }));

    const pagesParam = encodeURIComponent(JSON.stringify(pages));
    res.redirect(
      `${config?.adminUrl}/social-account/facebook/pages/?pages=${pagesParam}`,
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Save selected pages
facebookRouter.post("/save-pages", (req, res) => {
  const { pages } = req.body;
  if (!pages || pages.length === 0)
    return res.status(400).send("No pages selected");

  connectedPages = pages;

  res.json({ status: "success", savedPages: connectedPages });
});

// Send message via page
facebookRouter.post("/send-message", async (req, res) => {
  const { pageId, recipientId, message } = req.body;
  const page = connectedPages.find((p) => p.id === pageId);
  if (!page) return res.status(400).send("Page not connected");

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${page.access_token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
        }),
      },
    );
    const data = await fbRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message");
  }
});

// Webhook to receive messages
facebookRouter.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  // const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe") {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

facebookRouter.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
      });
    });
    return res.sendStatus(200);
  }

  res.sendStatus(404);
});

module.exports = facebookRouter;

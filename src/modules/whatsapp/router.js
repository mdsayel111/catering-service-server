

const express = require("express");
const fetch = require("node-fetch");
const config = require("../../config");

const whatsappRouter = express();
whatsappRouter.use(express.json());

// Temporary storage for connected WABA accounts
let connectedAccounts = [];

// 1️⃣ OAuth callback to connect WhatsApp Business account
whatsappRouter.get("/callback", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = "http://localhost:5000/api/whatsapp/callback";

  try {
    // Exchange code for user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${config.appId}&redirect_uri=${redirect_uri}&client_secret=${config.appSecret}&code=${code}`,
    );
    const tokenData = await tokenRes.json();
    const userToken = tokenData.access_token;

    if (!userToken) return res.status(400).send("Failed to get user token");

    // Fetch all WhatsApp Business accounts (WABA) the user manages
    const wabaRes = await fetch(
      `https://graph.facebook.com/v17.0/me/businesses?access_token=${userToken}`,
    );
    const wabaData = await wabaRes.json();

    const accounts = wabaData.data.map((b) => ({
      id: b.id,
      name: b.name,
      access_token: userToken, // for messaging
    }));

    const accountsParam = encodeURIComponent(JSON.stringify(accounts));
    res.redirect(
      `${config.adminUrl}/social-account/whatsapp?accounts=${accountsParam}`,
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Save selected WABA accounts
whatsappRouter.post("/save-accounts", (req, res) => {
  const { accounts } = req.body;
  if (!accounts || accounts.length === 0)
    return res.status(400).send("No accounts selected");

  connectedAccounts = accounts;

  res.json({ status: "success", savedAccounts: connectedAccounts });
});

// Send message via WhatsApp account
whatsappRouter.post("/send-message", async (req, res) => {
  const { accountId, recipientPhone, message } = req.body;
  const account = connectedAccounts.find((a) => a.id === accountId);
  if (!account) return res.status(400).send("Account not connected");

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v17.0/${account.id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${account.access_token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipientPhone,
          type: "text",
          text: { body: message },
        }),
      },
    );
    const data = await fbRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send WhatsApp message");
  }
});

module.exports = whatsappRouter;

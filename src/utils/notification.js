const config = require("../config");

const webpush = require("web-push");
const { subscriptions } = require("../data/notification");
/**
 * Send push notifications to all saved subscriptions
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} [data={}] - Optional custom payload (for extra data)
 */
async function sendNotification(title, body, data = {}) {
  if (!subscriptions.length) {
    console.warn("⚠️ No subscriptions found — skipping push send.");
    return;
  }

  const payload = JSON.stringify({ title, body, data });
  const results = [];

  for (const sub of subscriptions) {
    try {
      const result = await webpush.sendNotification(sub, payload);
      results.push(result);
    } catch (err) {
      console.error("❌ Push send error:", err);
    }
  }

}

const sendTelegramMessage = async (chatId, message) => {
  const url = `https://api.telegram.org/bot${config?.telegramBotToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Telegram error:", data);
    }

    return data;
  } catch (err) {
    console.error("Telegram error:", err);
  }
};

module.exports = { sendNotification, sendTelegramMessage };

require("dotenv").config();

const config = {
  dbUrl: process.env.DB_USER_URL || "mongodb://localhost:27017/default_db",
  openAiApiKey: process.env.OPEN_AI_API_KEY || "",
  port: process.env.PORT || 5000,
  appId: process.env.APP_ID || "",
  appSecret: process.env.APP_SECRET || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5173",
  secretKey: process.env.JWT_SECRET || "",
  googleAppPassword: process.env.GOOGLE_APP_PASSWORD || "",
  googleUser: process.env.GOOGLE_APP_USER || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/customer/google-callback",
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "",
  smsApiKey: process.env.SMS_API_KEY || "",
  smsSenderId: process.env.SMS_SENDER_ID || "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramAdminId: process.env.TELEGRAM_ADMIN_ID || "",
};

module.exports = config;

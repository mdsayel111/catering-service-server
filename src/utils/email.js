// utils/mailer.js
const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config?.googleUser,
    pass: config?.googleAppPassword,
  },
});

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"My App" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;

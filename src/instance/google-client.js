const { google } = require("googleapis");
const config = require("../config");

const googleClient = new google.auth.OAuth2(
  config?.googleClientId,
  config?.googleClientSecret,
  config?.googleCallbackUrl,
);

module.exports = googleClient;

const config = require("../config");

const sendSms = async ({ to, message }) => {
  try {
    const response = await fetch(
      `https://portal.smsorbis.com/api/sendSMS?ApiKey=${config?.smsApiKey}&SenderID=${config?.smsSenderId}&number=${to}&sms=${message}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendSms };

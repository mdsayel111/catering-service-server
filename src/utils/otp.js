// utils/otp/otp.js
const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function setOtp(email, value, minutes) {
  otpStore.set(email, { ...value, expires: Date.now() + minutes * 60 * 1000 });
}

function getOtp(email) {
  const entry = otpStore.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    otpStore.delete(email);
    return null;
  }
  return entry;
}

module.exports = { generateOtp, setOtp, getOtp, otpStore };

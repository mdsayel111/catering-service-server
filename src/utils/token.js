const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode (e.g., { id, role })
 * @returns {String} token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config?.secretKey, { expiresIn: "30d" });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT string
 * @returns {Object} decoded payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config?.secretKey);
  } catch (error) {
    return null; // invalid or expired token
  }
};

module.exports = { generateToken, verifyToken };

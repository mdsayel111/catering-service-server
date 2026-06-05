// utils/generateToken.js
const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {Object} user - user object
 * @param {string} user._id - user ID
 * @param {string} user.email - user email
 * @param {string} user.role - user role
 * @returns {string} token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      phone: user.phone,
      role: user.role || "user", // default role: user
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // token expires in 1 day
    }
  );
};

module.exports = generateToken;

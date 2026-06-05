// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Customer = require("../modules/customers/model");
const ManagementUser = require("../modules/management-users/model");

/**
 * Role-based auth middleware
 * @param  {...string} roles - allowed roles, e.g., authMiddleware("admin", "moderator")
 */
const authMiddleware = (...roles) => {
  const returnFun = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized access" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid token format" });
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err)
          return res
            .status(401)
            .json({ success: false, error: "Invalid or expired token" });
        if (decoded.role === "user") {
          const userFromDB = await Customer.findOne({
            phone: decoded.phone,
          }).select("-password");
          req.user = userFromDB;
          if (!userFromDB?.isActive) {
            return res.status(403).json({
              success: false,
              error: "Access denied: Your account is banned",
            });
          }
        } else if (decoded.role === "admin" || decoded.role === "super-admin") {
          const adminFromDB = await ManagementUser.findOne({
            username: decoded.username,
          }).select("-password");
          req.user = adminFromDB;
          if (!adminFromDB?.isActive) {
            return res.status(403).json({
              success: false,
              error: "Access denied: Your account is banned",
            });
          }
        }

        // If roles are specified, check if user role is allowed
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({
            success: false,
            error: "Access denied: insufficient permission",
          });
        }

        next();
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  };
  return returnFun;
};

module.exports = authMiddleware;

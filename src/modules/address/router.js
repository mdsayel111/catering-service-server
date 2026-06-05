const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("./controller");

const addressRouter = express.Router();

// Create address
addressRouter.post("/", authMiddleware("super-admin"), createAddress);

// Get all addresses (optional filteria query param)
addressRouter.get("/", authMiddleware("super-admin", "user"), getAddresses);

// Get single address
addressRouter.get("/:id", authMiddleware("super-admin"), getAddressById);

// Update address
addressRouter.put("/:id", authMiddleware("super-admin"), updateAddress);

// Delete address (hard delete)
addressRouter.delete("/:id", authMiddleware("super-admin"), deleteAddress);

module.exports = addressRouter;

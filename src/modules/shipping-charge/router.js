const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createShippingCharge,
  getShippingCharges,
  getShippingChargeById,
  updateShippingCharge,
  deleteShippingCharge,
} = require("./controller");

const shippingChargeRouter = express.Router();

// Create shippingCharge
shippingChargeRouter.post("/", authMiddleware("admin", "super-admin"), createShippingCharge);

// Get all shippingCharges
shippingChargeRouter.get("/", getShippingCharges);

// Get single shippingCharge
shippingChargeRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getShippingChargeById
);

// Update shippingCharge
shippingChargeRouter.put("/:id", authMiddleware("admin", "super-admin"), updateShippingCharge);

// Soft delete (toggle active)
shippingChargeRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteShippingCharge);

module.exports = shippingChargeRouter;

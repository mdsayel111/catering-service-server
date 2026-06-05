const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createReturnAndRefund,
  getReturnAndRefunds,
  getReturnAndRefundById,
  updateReturnAndRefund,
  deleteReturnAndRefund,
} = require("./controller");

const returnAndRefundRouter = express.Router();

// Create returnAndRefund
returnAndRefundRouter.post("/", authMiddleware("admin", "super-admin"), createReturnAndRefund);

// Get all returnAndRefunds
returnAndRefundRouter.get("/", getReturnAndRefunds);

// Get single returnAndRefund
returnAndRefundRouter.get(
  "/:id",
  getReturnAndRefundById
);

// Update returnAndRefund
returnAndRefundRouter.put("/:id", authMiddleware("admin", "super-admin"), updateReturnAndRefund);

// Soft delete (toggle active)
returnAndRefundRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteReturnAndRefund);

module.exports = returnAndRefundRouter;

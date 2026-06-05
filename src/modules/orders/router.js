const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder,
} = require("./controller");

const orderRouter = express.Router();

orderRouter.put(
  "/cancel/:id",
  authMiddleware("user"),
  cancelOrder,
);

// 🧾 Create a new order (customers can place orders)
orderRouter.post("/", createOrder);

// 📦 Get all orders (admins & super-admins only)
orderRouter.get("/", authMiddleware("user", "admin", "super-admin"), getOrders);

// 🔍 Get single order (customer can view their own, admin can view all)
orderRouter.get(
  "/:id",
  authMiddleware("user", "admin", "super-admin"),
  getOrderById,
);

// ✏️ Update order (e.g. change status or payment info)
orderRouter.put("/:id", authMiddleware("admin", "super-admin"), updateOrder);

// ❌ Cancel or delete order (soft delete)
orderRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteOrder);

module.exports = orderRouter;

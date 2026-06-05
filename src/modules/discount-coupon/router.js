const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createDiscountCoupon,
  getDiscountCoupons,
  getDiscountCouponById,
  updateDiscountCoupon,
  deleteDiscountCoupon,
} = require("./controller");

const discountCouponRouter = express.Router();

// Create discountCoupon
discountCouponRouter.post("/", authMiddleware("admin", "super-admin"), createDiscountCoupon);

// Get all discountCoupons
discountCouponRouter.get("/", getDiscountCoupons);

// Get single discountCoupon
discountCouponRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getDiscountCouponById
);

// Update discountCoupon
discountCouponRouter.put("/:id", authMiddleware("admin", "super-admin"), updateDiscountCoupon);

// Soft delete (toggle active)
discountCouponRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteDiscountCoupon);

module.exports = discountCouponRouter;

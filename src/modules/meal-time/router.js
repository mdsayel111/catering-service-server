const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createPromotion,
  getCategories,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} = require("./controller");

const promotionRouter = express.Router();

// Create promotion
promotionRouter.post(
  "/",
  authMiddleware("admin", "super-admin"),
  createPromotion,
);

// Get all
promotionRouter.get("/", getCategories);

// Get one
promotionRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getPromotionById,
);

// Update
promotionRouter.put(
  "/:id",
  authMiddleware("admin", "super-admin"),
  updatePromotion,
);

// Soft delete
promotionRouter.delete(
  "/:id",
  authMiddleware("admin", "super-admin"),
  deletePromotion,
);

module.exports = promotionRouter;

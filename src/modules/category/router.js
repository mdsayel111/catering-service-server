const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./controller");

const categoryRouter = express.Router();

// Create category
categoryRouter.post(
  "/",
  authMiddleware("admin", "super-admin"),
  createCategory,
);

// Get all
categoryRouter.get("/", getCategories);

// Get one
categoryRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getCategoryById,
);

// Update
categoryRouter.put(
  "/:id",
  authMiddleware("admin", "super-admin"),
  updateCategory,
);

// Soft delete
categoryRouter.delete(
  "/",
  authMiddleware("admin", "super-admin"),
  deleteCategory,
);

module.exports = categoryRouter;

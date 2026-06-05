const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createColor,
  getColors,
  getColorById,
  updateColor,
  deleteColor,
} = require("./controller");

const colorRouter = express.Router();

// Create color
colorRouter.post("/", authMiddleware("admin", "super-admin"), createColor);

// Get all colors
colorRouter.get("/", getColors);

// Get single color
colorRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getColorById
);

// Update color
colorRouter.put("/:id", authMiddleware("admin", "super-admin"), updateColor);

// Soft delete (toggle active)
colorRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteColor);

module.exports = colorRouter;

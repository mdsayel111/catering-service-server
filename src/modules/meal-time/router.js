const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createMealTime,
  getMealTimes,
  getMealTimeById,
  updateMealTime,
  deleteMealTime,
} = require("./controller");

const mealTimeRouter = express.Router();

// Create MealTime
mealTimeRouter.post(
  "/",
  authMiddleware("admin", "super-admin"),
  createMealTime
);

// Get all MealTimes
mealTimeRouter.get("/", getMealTimes);

// Get single MealTime
mealTimeRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getMealTimeById
);

// Update MealTime
mealTimeRouter.put(
  "/:id",
  authMiddleware("admin", "super-admin"),
  updateMealTime
);

// Toggle active status
mealTimeRouter.delete(
  "/:id",
  authMiddleware("admin", "super-admin"),
  deleteMealTime
);

module.exports = mealTimeRouter;
const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("./controller");

const feedbackRouter = express.Router();

// Create feedback
feedbackRouter.post("/", authMiddleware("user", "admin", "super-admin"), createFeedback);

// Get all feedbacks
feedbackRouter.get("/", authMiddleware("admin", "super-admin"), getFeedbacks);

// Get single feedback
feedbackRouter.get("/:id", authMiddleware("user", "admin", "super-admin"), getFeedbackById);

// Update feedback
feedbackRouter.put("/:id", authMiddleware("user", "admin", "super-admin"), updateFeedback);

// Soft delete / toggle active
feedbackRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteFeedback);

module.exports = feedbackRouter;

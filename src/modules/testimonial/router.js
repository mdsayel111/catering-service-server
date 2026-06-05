const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require("./controller");

const testimonialRouter = express.Router();

// Public
testimonialRouter.get("/", getTestimonials);
testimonialRouter.get("/:id", getTestimonialById);

// Protected
testimonialRouter.post("/", authMiddleware("user"), createTestimonial);
testimonialRouter.put("/:id", authMiddleware("admin", "super-admin"), updateTestimonial);
testimonialRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteTestimonial);

module.exports = testimonialRouter;

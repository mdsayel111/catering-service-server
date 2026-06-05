const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createFAQ,
  getFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
} = require("./controller");

const faqRouter = express.Router();

// Create FAQ
faqRouter.post("/", authMiddleware("admin", "super-admin"), createFAQ);

// Get all FAQs
faqRouter.get("/", getFAQs);

// Get single FAQ
faqRouter.get("/:id", getFAQById);

// Update FAQ
faqRouter.put("/:id", authMiddleware("admin", "super-admin"), updateFAQ);

// Soft delete (toggle isActive)
faqRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteFAQ);

module.exports = faqRouter;

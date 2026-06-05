const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createLogo,
  getLogos,
  getLogoById,
  updateLogo,
  deleteLogo,
} = require("./controller");

const logoRouter = express.Router();

// Create logo
logoRouter.post("/", authMiddleware("admin", "super-admin"), createLogo);

// Get all logos
logoRouter.get("/", getLogos);

// Get single logo
logoRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getLogoById
);

// Update logo
logoRouter.put("/:id", authMiddleware("admin", "super-admin"), updateLogo);

// Soft delete (toggle active)
logoRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteLogo);

module.exports = logoRouter;

const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} = require("./controller");

const bannerRouter = express.Router();

// Create banner
bannerRouter.post("/", authMiddleware("admin", "super-admin"), createBanner);

// Get all banners
bannerRouter.get("/", getBanners);

// Get single banner
bannerRouter.get(
  "/:id",
  authMiddleware("admin", "super-admin", "user"),
  getBannerById
);

// Update banner
bannerRouter.put("/:id", authMiddleware("admin", "super-admin"), updateBanner);

// Soft delete (toggle active)
bannerRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteBanner);

module.exports = bannerRouter;

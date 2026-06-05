const express = require("express");
const {
  getSettings,
  getHomePageData,
  getFooterData,
  getProductsPageData,
  getCartPageData,
  getBlogPageData,
  getUserProfilePageData,
  getAboutPageData,
  getFaqPageData,
  getOrders,
} = require("./controller");
const authMiddleware = require("../../middlewares/auth");

const clientRouter = express.Router();

// Create client
clientRouter.get("/settings", getSettings);
clientRouter.get("/footer", getFooterData);
clientRouter.get("/home-page", getHomePageData);
clientRouter.get("/products-page", getProductsPageData);
clientRouter.get("/cart-page", getCartPageData);
clientRouter.get("/blog-page", getBlogPageData);
clientRouter.get(
  "/user-profile-page",
  authMiddleware("user"),
  getUserProfilePageData,
);
clientRouter.get("/about-page", getAboutPageData);
clientRouter.get("/faq-page", getFaqPageData);
clientRouter.get("/orders", authMiddleware("user"), getOrders);

module.exports = clientRouter;

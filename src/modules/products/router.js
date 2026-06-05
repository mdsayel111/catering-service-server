const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByIds,
} = require("./controller");

const productRouter = express.Router();

productRouter.get("/get-by-ids", getProductByIds);

// Create product
productRouter.post("/", authMiddleware("admin", "super-admin"), createProduct);

// Get all products
productRouter.get("/", getProducts);

// Get single product
productRouter.get(
  "/:id",
  getProductById
);

// Update product
productRouter.put("/:id", authMiddleware("admin", "super-admin"), updateProduct);

// Soft delete (toggle active)
productRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteProduct);

// Get products by ids

module.exports = productRouter;

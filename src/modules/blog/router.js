const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("./controller");

const blogRouter = express.Router();

// Create blog
blogRouter.post("/", authMiddleware("admin", "super-admin"), createBlog);

// Get all blogs
blogRouter.get("/", getBlogs);

// Get single blog
blogRouter.get(
  "/:id",
  getBlogById
);

// Update blog
blogRouter.put("/:id", authMiddleware("admin", "super-admin"), updateBlog);

// Soft delete (toggle active)
blogRouter.delete("/:id", authMiddleware("admin", "super-admin"), deleteBlog);

module.exports = blogRouter;

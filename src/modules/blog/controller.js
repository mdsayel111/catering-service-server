const asyncErrorHandler = require("../../HOF/async-error-handler");
const Blog = require("./model");

// Create Blog
const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    let { search, isActive } = req.query;

    // Build query object dynamically
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true"; // query params are strings
    }

    const blogs = await Blog.find(query);
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get single blog
const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog)
    return res.status(404).json({ success: false, error: "Blog not found" });

  res.status(200).json({ success: true, data: blog });
};

// Update blog
const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog)
    return res.status(404).json({ success: false, error: "Blog not found" });

  res.status(200).json({ success: true, data: blog });
};

// Soft delete / toggle active
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog)
    return res.status(404).json({ success: false, error: "Blog not found" });

  await Blog.findByIdAndUpdate(id, { isActive: !blog.isActive });
  res.status(200).json({
    success: true,
    message: "Blog status updated successfully",
  });
};

module.exports = {
  createBlog: asyncErrorHandler(createBlog),
  getBlogs: asyncErrorHandler(getBlogs),
  getBlogById: asyncErrorHandler(getBlogById),
  updateBlog: asyncErrorHandler(updateBlog),
  deleteBlog: asyncErrorHandler(deleteBlog),
};

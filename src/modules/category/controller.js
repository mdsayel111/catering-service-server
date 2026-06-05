const asyncErrorHandler = require("../../HOF/async-error-handler");
const Category = require("./model");

// Create Category
const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    // Build query object dynamically
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true"; // query params are strings
    }

    const categories = await Category.find(query);
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return res
      .status(404)
      .json({ success: false, error: "Category not found" });
  res.status(200).json({ success: true, data: category });
};

// Update category
const updateCategory = async (req, res) => {

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category)
    return res
      .status(404)
      .json({ success: false, error: "Category not found" });
  res.status(200).json({ success: true, data: category });
};

// Soft delete / toggle active
const deleteCategory = async (req, res) => {
  const { id } = req.body;
  const category = await Category.findById(id);
  if (!category)
    return res
      .status(404)
      .json({ success: false, error: "Category not found" });
  await Category.findByIdAndUpdate(id, { isActive: !category.isActive });
  res
    .status(200)
    .json({ success: true, message: "Category status updated successfully" });
};

module.exports = {
  createCategory: asyncErrorHandler(createCategory),
  getCategories: asyncErrorHandler(getCategories),
  getCategoryById: asyncErrorHandler(getCategoryById),
  updateCategory: asyncErrorHandler(updateCategory),
  deleteCategory: asyncErrorHandler(deleteCategory),
};

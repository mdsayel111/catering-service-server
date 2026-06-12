const asyncErrorHandler = require("../../HOF/async-error-handler");
const Promotion = require("./model");

// Create Promotion
const createPromotion = async (req, res) => {
  const promotion = await Promotion.create(req.body);
  res.status(201).json({ success: true, data: promotion });
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { isActive } = req.query;

    // Build query object dynamically
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true"; // query params are strings
    }

    const categories = await Promotion.find(query);
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single promotion
const getPromotionById = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion)
    return res
      .status(404)
      .json({ success: false, error: "Promotion not found" });
  res.status(200).json({ success: true, data: promotion });
};

// Update promotion
const updatePromotion = async (req, res) => {

  const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!promotion)
    return res
      .status(404)
      .json({ success: false, error: "Promotion not found" });
  res.status(200).json({ success: true, data: promotion });
};

// Soft delete / toggle active
const deletePromotion = async (req, res) => {
  const { id } = req.params;
  const promotion = await Promotion.findById(id);
  if (!promotion)
    return res
      .status(404)
      .json({ success: false, error: "Promotion not found" });
  await Promotion.findByIdAndUpdate(id, { isActive: !promotion.isActive });
  res
    .status(200)
    .json({ success: true, message: "Promotion status updated successfully" });
};

module.exports = {
  createPromotion: asyncErrorHandler(createPromotion),
  getCategories: asyncErrorHandler(getCategories),
  getPromotionById: asyncErrorHandler(getPromotionById),
  updatePromotion: asyncErrorHandler(updatePromotion),
  deletePromotion: asyncErrorHandler(deletePromotion),
};

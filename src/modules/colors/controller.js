const asyncErrorHandler = require("../../HOF/async-error-handler");
const Color = require("./model");

// Create Color
const createColor = async (req, res) => {
  const data = req.body;
  const colorsFromDb = await Color.find();
  if (colorsFromDb.length > 0)
    return res.status(400).json({ success: false, error: "Color already exists" });
  const color = await Color.create(data);
  res.status(201).json({ success: true, data: color });
};

// Get all colors
const getColors = async (req, res) => {
  const query = req.query;
  if (query.isActive) {
    const colors = await Color.find({ isActive: query.isActive });
    res.status(200).json({ success: true, data: colors });
    return;
  }
  const colors = await Color.find();
  res.status(200).json({ success: true, data: colors });
};

// Get single color
const getColorById = async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color)
    return res.status(404).json({ success: false, error: "Color not found" });
  res.status(200).json({ success: true, data: color });
};

// Update color
const updateColor = async (req, res) => {
  const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!color)
    return res.status(404).json({ success: false, error: "Color not found" });
  res.status(200).json({ success: true, data: color });
};

// Soft delete / toggle active
const deleteColor = async (req, res) => {
  const { id } = req.params;
  const color = await Color.findById(id);
  if (!color)
    return res.status(404).json({ success: false, error: "Color not found" });
  await Color.findByIdAndUpdate(id, { isActive: !color.isActive });
  res.status(200).json({
    success: true,
    message: "Color status updated successfully",
  });
};

module.exports = {
  createColor: asyncErrorHandler(createColor),
  getColors: asyncErrorHandler(getColors),
  getColorById: asyncErrorHandler(getColorById),
  updateColor: asyncErrorHandler(updateColor),
  deleteColor: asyncErrorHandler(deleteColor),
};

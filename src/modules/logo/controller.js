const asyncErrorHandler = require("../../HOF/async-error-handler");
const Logo = require("./model");

// Create Logo
const createLogo = async (req, res) => {
  const data = req.body;
  const logosFromDb = await Logo.find();
  if (logosFromDb.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Logo already exists" });
  const logo = await Logo.create(data);
  res.status(201).json({ success: true, data: logo });
};

// Get all logos
const getLogos = async (req, res) => {
  const logos = await Logo.findOne();
  res.status(200).json({ success: true, data: logos });
};

// Get single logo
const getLogoById = async (req, res) => {
  const logo = await Logo.findById(req.params.id);
  if (!logo)
    return res.status(404).json({ success: false, error: "Logo not found" });
  res.status(200).json({ success: true, data: logo });
};

// Update logo
const updateLogo = async (req, res) => {
  const logo = await Logo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!logo)
    return res.status(404).json({ success: false, error: "Logo not found" });
  res.status(200).json({ success: true, data: logo });
};

// Soft delete / toggle active
const deleteLogo = async (req, res) => {
  const { id } = req.params;
  const logo = await Logo.findById(id);
  if (!logo)
    return res.status(404).json({ success: false, error: "Logo not found" });
  await Logo.findByIdAndUpdate(id, { isActive: !logo.isActive });
  res.status(200).json({
    success: true,
    message: "Logo status updated successfully",
  });
};

module.exports = {
  createLogo: asyncErrorHandler(createLogo),
  getLogos: asyncErrorHandler(getLogos),
  getLogoById: asyncErrorHandler(getLogoById),
  updateLogo: asyncErrorHandler(updateLogo),
  deleteLogo: asyncErrorHandler(deleteLogo),
};

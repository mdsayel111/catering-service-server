const asyncErrorHandler = require("../../HOF/async-error-handler");
const Banner = require("./model");

// Create Banner
const createBanner = async (req, res) => {
  const data = req.body;
  const banner = await Banner.create(data);
  res.status(201).json({ success: true, data: banner });
};

// Get all banners
const getBanners = async (req, res) => {
  const query = req.query;
  if (query.isActive) {
    const banners = await Banner.find({ isActive: query.isActive });
    res.status(200).json({ success: true, data: banners });
    return;
  }
  const banners = await Banner.find();
  res.status(200).json({ success: true, data: banners });
};

// Get single banner
const getBannerById = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner)
    return res.status(404).json({ success: false, error: "Banner not found" });
  res.status(200).json({ success: true, data: banner });
};

// Update banner
const updateBanner = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner)
    return res.status(404).json({ success: false, error: "Banner not found" });
  res.status(200).json({ success: true, data: banner });
};

// Soft delete / toggle active
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner)
    return res.status(404).json({ success: false, error: "Banner not found" });
  await Banner.findByIdAndUpdate(id, { isActive: !banner.isActive });
  res.status(200).json({
    success: true,
    message: "Banner status updated successfully",
  });
};

module.exports = {
  createBanner: asyncErrorHandler(createBanner),
  getBanners: asyncErrorHandler(getBanners),
  getBannerById: asyncErrorHandler(getBannerById),
  updateBanner: asyncErrorHandler(updateBanner),
  deleteBanner: asyncErrorHandler(deleteBanner),
};

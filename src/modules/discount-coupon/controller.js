const asyncErrorHandler = require("../../HOF/async-error-handler");
const DiscountCoupon = require("./model");

// Create DiscountCoupon
const createDiscountCoupon = async (req, res) => {
  const data = req.body;
  const discountCouponsFromDb = await DiscountCoupon.find();
  if (discountCouponsFromDb.length > 0)
    return res.status(400).json({ success: false, error: "DiscountCoupon already exists" });
  const discountCoupon = await DiscountCoupon.create(data);
  res.status(201).json({ success: true, data: discountCoupon });
};

// Get all discountCoupons
const getDiscountCoupons = async (req, res) => {
  const query = req.query;
  if (query.isActive) {
    const discountCoupons = await DiscountCoupon.find({ isActive: query.isActive });
    res.status(200).json({ success: true, data: discountCoupons });
    return;
  }
  const discountCoupons = await DiscountCoupon.find();
  res.status(200).json({ success: true, data: discountCoupons });
};

// Get single discountCoupon
const getDiscountCouponById = async (req, res) => {
  const discountCoupon = await DiscountCoupon.findById(req.params.id);
  if (!discountCoupon)
    return res.status(404).json({ success: false, error: "DiscountCoupon not found" });
  res.status(200).json({ success: true, data: discountCoupon });
};

// Update discountCoupon
const updateDiscountCoupon = async (req, res) => {
  const discountCoupon = await DiscountCoupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!discountCoupon)
    return res.status(404).json({ success: false, error: "DiscountCoupon not found" });
  res.status(200).json({ success: true, data: discountCoupon });
};

// Soft delete / toggle active
const deleteDiscountCoupon = async (req, res) => {
  const { id } = req.params;
  const discountCoupon = await DiscountCoupon.findById(id);
  if (!discountCoupon)
    return res.status(404).json({ success: false, error: "DiscountCoupon not found" });
  await DiscountCoupon.findByIdAndUpdate(id, { isActive: !discountCoupon.isActive });
  res.status(200).json({
    success: true,
    message: "DiscountCoupon status updated successfully",
  });
};

module.exports = {
  createDiscountCoupon: asyncErrorHandler(createDiscountCoupon),
  getDiscountCoupons: asyncErrorHandler(getDiscountCoupons),
  getDiscountCouponById: asyncErrorHandler(getDiscountCouponById),
  updateDiscountCoupon: asyncErrorHandler(updateDiscountCoupon),
  deleteDiscountCoupon: asyncErrorHandler(deleteDiscountCoupon),
};

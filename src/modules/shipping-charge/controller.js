const asyncErrorHandler = require("../../HOF/async-error-handler");
const ShippingCharge = require("./model");

// Create ShippingCharge
const createShippingCharge = async (req, res) => {
  const data = req.body;
  const shippingChargesFromDb = await ShippingCharge.find();
  if (shippingChargesFromDb.length > 0)
    return res.status(400).json({ success: false, error: "ShippingCharge already exists" });
  const shippingCharge = await ShippingCharge.create(data);
  res.status(201).json({ success: true, data: shippingCharge });
};

// Get all shippingCharges
const getShippingCharges = async (req, res) => {
  const query = req.query;
  if (query.isActive) {
    const shippingCharges = await ShippingCharge.find({ isActive: query.isActive });
    res.status(200).json({ success: true, data: shippingCharges });
    return;
  }
  const shippingCharges = await ShippingCharge.find();
  res.status(200).json({ success: true, data: shippingCharges });
};

// Get single shippingCharge
const getShippingChargeById = async (req, res) => {
  const shippingCharge = await ShippingCharge.findById(req.params.id);
  if (!shippingCharge)
    return res.status(404).json({ success: false, error: "ShippingCharge not found" });
  res.status(200).json({ success: true, data: shippingCharge });
};

// Update shippingCharge
const updateShippingCharge = async (req, res) => {
  const shippingCharge = await ShippingCharge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!shippingCharge)
    return res.status(404).json({ success: false, error: "ShippingCharge not found" });
  res.status(200).json({ success: true, data: shippingCharge });
};

// Soft delete / toggle active
const deleteShippingCharge = async (req, res) => {
  const { id } = req.params;
  const shippingCharge = await ShippingCharge.findById(id);
  if (!shippingCharge)
    return res.status(404).json({ success: false, error: "ShippingCharge not found" });
  await ShippingCharge.findByIdAndUpdate(id, { isActive: !shippingCharge.isActive });
  res.status(200).json({
    success: true,
    message: "ShippingCharge status updated successfully",
  });
};

module.exports = {
  createShippingCharge: asyncErrorHandler(createShippingCharge),
  getShippingCharges: asyncErrorHandler(getShippingCharges),
  getShippingChargeById: asyncErrorHandler(getShippingChargeById),
  updateShippingCharge: asyncErrorHandler(updateShippingCharge),
  deleteShippingCharge: asyncErrorHandler(deleteShippingCharge),
};

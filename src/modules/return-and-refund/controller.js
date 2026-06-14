const asyncErrorHandler = require("../../HOF/async-error-handler");
const ReturnAndRefund = require("./model");

// Create ReturnAndRefund
const createReturnAndRefund = async (req, res) => {
  const returnAndRefund = await ReturnAndRefund.create(req.body);
  res.status(201).json({ success: true, data: returnAndRefund });
};

// Get all returnAndRefunds
const getReturnAndRefunds = async (req, res) => {
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

    const returnAndRefunds = await ReturnAndRefund.find(query);
    res.status(200).json({ success: true, data: returnAndRefunds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get single returnAndRefund
const getReturnAndRefundById = async (req, res) => {
  const returnAndRefund = await ReturnAndRefund.findById(req.params.id);
  if (!returnAndRefund)
    return res.status(404).json({ success: false, error: "ReturnAndRefund not found" });

  res.status(200).json({ success: true, data: returnAndRefund });
};

// Update returnAndRefund
const updateReturnAndRefund = async (req, res) => {
  const returnAndRefund = await ReturnAndRefund.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!returnAndRefund)
    return res.status(404).json({ success: false, error: "ReturnAndRefund not found" });

  res.status(200).json({ success: true, data: returnAndRefund });
};

// Soft delete / toggle active
const deleteReturnAndRefund = async (req, res) => {
  const { id } = req.params;
  const returnAndRefund = await ReturnAndRefund.findById(id);
  if (!returnAndRefund)
    return res.status(404).json({ success: false, error: "ReturnAndRefund not found" });

  await ReturnAndRefund.findByIdAndUpdate(id, { isActive: !returnAndRefund.isActive });
  res.status(200).json({
    success: true,
    message: "ReturnAndRefund status updated successfully",
  });
};

module.exports = {
  createReturnAndRefund: asyncErrorHandler(createReturnAndRefund),
  getReturnAndRefunds: asyncErrorHandler(getReturnAndRefunds),
  getReturnAndRefundById: asyncErrorHandler(getReturnAndRefundById),
  updateReturnAndRefund: asyncErrorHandler(updateReturnAndRefund),
  deleteReturnAndRefund: asyncErrorHandler(deleteReturnAndRefund),
};
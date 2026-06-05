const Address = require("../../global-models/address-model");
const asyncErrorHandler = require("../../HOF/async-error-handler");

// Create Address
const createAddress = async (req, res) => {
  const data = req.body;
  if (data?.type === "store") {
    const existingStoreAddress = await Address.findOne({ type: "store" });
    if (existingStoreAddress) {
      return res
        .status(400)
        .json({ success: false, error: "Store address already exists" });
    }
  } else {
    const isUserAddressExists = await Address.findOne({
      user: data.user,
      isPrimary: true,
    });
    if (isUserAddressExists) {
      return res.status(400).json({
        success: false,
        error: "Primary address for user already exists",
      });
    }
  }
  const address = await Address.create(data);
  res.status(201).json({ success: true, data: address });
};

// Get all Addresses (with optional filter by user)
const getAddresses = async (req, res) => {
  const user = req.user;

  if (user.role === "user") {
    const addresses = await Address.findOne({
      user: user._id,
      isPrimary: true,
    });
    return res.status(200).json({ success: true, data: addresses });
  }
  const query = req.query;

  const filter = {};
  if (query.user) {
    filter.user = query.user;
  }

  const addresses = await Address.find(filter);
  res.status(200).json({ success: true, data: addresses });
};

// Get single Address by ID
const getAddressById = async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address)
    return res.status(404).json({ success: false, error: "Address not found" });

  res.status(200).json({ success: true, data: address });
};

// Update Address
const updateAddress = async (req, res) => {
  const { type, isPrimary, user, ...rest } = req.body;
  const address = await Address.findByIdAndUpdate(req.params.id, rest, {
    new: true,
    runValidators: true,
  });

  if (!address)
    return res.status(404).json({ success: false, error: "Address not found" });

  res.status(200).json({ success: true, data: address });
};

// Delete Address (hard delete)
const deleteAddress = async (req, res) => {
  const address = await Address.findByIdAndDelete(req.params.id);

  if (!address)
    return res.status(404).json({ success: false, error: "Address not found" });

  res
    .status(200)
    .json({ success: true, message: "Address deleted successfully" });
};

module.exports = {
  createAddress: asyncErrorHandler(createAddress),
  getAddresses: asyncErrorHandler(getAddresses),
  getAddressById: asyncErrorHandler(getAddressById),
  updateAddress: asyncErrorHandler(updateAddress),
  deleteAddress: asyncErrorHandler(deleteAddress),
};

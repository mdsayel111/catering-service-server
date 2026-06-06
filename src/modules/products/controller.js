const asyncErrorHandler = require("../../HOF/async-error-handler");
const Product = require("./model");

// Create Product
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
};

// Get all products
const getProducts = async (req, res) => {
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

    const products = await Product.find(query).populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get single product
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product)
    return res.status(404).json({ success: false, error: "Product not found" });

  res.status(200).json({ success: true, data: product });
};

// Update product
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    return res.status(404).json({ success: false, error: "Product not found" });

  res.status(200).json({ success: true, data: product });
};

// Soft delete / toggle active
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product)
    return res.status(404).json({ success: false, error: "Product not found" });

  await Product.findByIdAndUpdate(id, { isActive: !product.isActive });
  res.status(200).json({
    success: true,
    message: "Product status updated successfully",
  });
};

const getProductByIds = async (req, res) => {
  let { ids } = req.query;
  let products = [];
  // If ids is present, get products by ids
  if (ids) {
    const idsArray = ids.split(",");
    products = await Product.find({ _id: { $in: idsArray }, isActive: true });
  }
  res.status(200).json({ success: true, data: products });
};

module.exports = {
  createProduct: asyncErrorHandler(createProduct),
  getProducts: asyncErrorHandler(getProducts),
  getProductById: asyncErrorHandler(getProductById),
  updateProduct: asyncErrorHandler(updateProduct),
  deleteProduct: asyncErrorHandler(deleteProduct),
  getProductByIds: asyncErrorHandler(getProductByIds),
};

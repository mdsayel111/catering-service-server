const asyncErrorHandler = require("../../HOF/async-error-handler");
const FAQ = require("./model");

// Create FAQ
const createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: faq });
};

// Get all FAQs
const getFAQs = async (req, res) => {
  try {
    let { search, isActive } = req.query;

    const query = {};
    if (search) {
      query.question = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const faqs = await FAQ.find(query);
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single FAQ
const getFAQById = async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq)
    return res.status(404).json({ success: false, error: "FAQ not found" });

  res.status(200).json({ success: true, data: faq });
};

// Update FAQ
const updateFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq)
    return res.status(404).json({ success: false, error: "FAQ not found" });

  res.status(200).json({ success: true, data: faq });
};

// Soft delete / toggle active
const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  const faq = await FAQ.findById(id);
  if (!faq)
    return res.status(404).json({ success: false, error: "FAQ not found" });

  await FAQ.findByIdAndUpdate(id, { isActive: !faq.isActive });
  res.status(200).json({
    success: true,
    message: "FAQ status updated successfully",
  });
};

module.exports = {
  createFAQ: asyncErrorHandler(createFAQ),
  getFAQs: asyncErrorHandler(getFAQs),
  getFAQById: asyncErrorHandler(getFAQById),
  updateFAQ: asyncErrorHandler(updateFAQ),
  deleteFAQ: asyncErrorHandler(deleteFAQ),
};

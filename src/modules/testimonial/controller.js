const Testimonial = require("./model");
const asyncErrorHandler = require("../../HOF/async-error-handler");

// Create
const createTestimonial = async (req, res) => {
  const user = req.user;
  const testimonial = await Testimonial.create({ user: user._id, ...req.body, isActive: false });
  res.status(201).json({ success: true, data: testimonial });
};

// Get all
const getTestimonials = async (req, res) => {
  let { search, isActive } = req.query;

  const query = {};
  if (search) {
    query.text = { $regex: search, $options: "i" };
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const testimonials = await Testimonial.find(query).sort({ createdAt: -1 }).populate("user");
  res.status(200).json({ success: true, data: testimonials });
};

// Get single
const getTestimonialById = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id).populate("user");
  if (!testimonial) {
    return res
      .status(404)
      .json({ success: false, message: "Testimonial not found" });
  }

  res.status(200).json({ success: true, data: testimonial });
};

// Update
const updateTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  ).populate("user");
  if (!testimonial) {
    return res
      .status(404)
      .json({ success: false, message: "Testimonial not found" });
  }

  res.status(200).json({ success: true, data: testimonial });
};

// Soft Delete (toggle active)
const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    return res
      .status(404)
      .json({ success: false, message: "Testimonial not found" });
  }

  testimonial.isActive = !testimonial.isActive;
  await testimonial.save();

  res
    .status(200)
    .json({ success: true, message: "Testimonial status updated" });
};

module.exports = {
  createTestimonial: asyncErrorHandler(createTestimonial),
  getTestimonials: asyncErrorHandler(getTestimonials),
  getTestimonialById: asyncErrorHandler(getTestimonialById),
  updateTestimonial: asyncErrorHandler(updateTestimonial),
  deleteTestimonial: asyncErrorHandler(deleteTestimonial),
};

const asyncErrorHandler = require("../../HOF/async-error-handler");
const Feedback = require("./model");

// Create feedback
const createFeedback = async (req, res) => {
  const data = req.body;
  const feedback = await Feedback.create(data);
  res.status(201).json({ success: true, data: feedback });
};

// Get all feedbacks
const getFeedbacks = async (req, res) => {
  const query = req.query;
  let feedbacks;

  if (query.isActive) {
    feedbacks = await Feedback.find({ isActive: query.isActive }).populate("user", "name email");
  } else {
    feedbacks = await Feedback.find().populate("user", "name email");
  }

  res.status(200).json({ success: true, data: feedbacks });
};

// Get single feedback
const getFeedbackById = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id).populate("user", "name email");
  if (!feedback)
    return res.status(404).json({ success: false, error: "Feedback not found" });
  res.status(200).json({ success: true, data: feedback });
};

// Update feedback
const updateFeedback = async (req, res) => {
  const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!feedback)
    return res.status(404).json({ success: false, error: "Feedback not found" });
  res.status(200).json({ success: true, data: feedback });
};

// Soft delete / toggle active
const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const feedback = await Feedback.findById(id);
  if (!feedback)
    return res.status(404).json({ success: false, error: "Feedback not found" });

  await Feedback.findByIdAndUpdate(id, { isActive: !feedback.isActive });
  res.status(200).json({
    success: true,
    message: "Feedback status updated successfully",
  });
};

module.exports = {
  createFeedback: asyncErrorHandler(createFeedback),
  getFeedbacks: asyncErrorHandler(getFeedbacks),
  getFeedbackById: asyncErrorHandler(getFeedbackById),
  updateFeedback: asyncErrorHandler(updateFeedback),
  deleteFeedback: asyncErrorHandler(deleteFeedback),
};

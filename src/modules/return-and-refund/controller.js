const asyncErrorHandler = require("../../HOF/async-error-handler");
const MealTime = require("./model");

// Create MealTime
const createMealTime = async (req, res) => {
  const mealTime = await MealTime.create(req.body);
  res.status(201).json({ success: true, data: mealTime });
};

// Get all MealTimes
const getMealTimes = async (req, res) => {
  try {
    let { search, isActive } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const mealTimes = await MealTime.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: mealTimes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single MealTime
const getMealTimeById = async (req, res) => {
  const mealTime = await MealTime.findById(req.params.id);

  if (!mealTime) {
    return res.status(404).json({
      success: false,
      error: "MealTime not found",
    });
  }

  res.status(200).json({ success: true, data: mealTime });
};

// Update MealTime
const updateMealTime = async (req, res) => {
  const mealTime = await MealTime.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!mealTime) {
    return res.status(404).json({
      success: false,
      error: "MealTime not found",
    });
  }

  res.status(200).json({ success: true, data: mealTime });
};

// Soft delete / toggle active
const deleteMealTime = async (req, res) => {
  const { id } = req.params;

  const mealTime = await MealTime.findById(id);

  if (!mealTime) {
    return res.status(404).json({
      success: false,
      error: "MealTime not found",
    });
  }

  await MealTime.findByIdAndUpdate(id, {
    isActive: !mealTime.isActive,
  });

  res.status(200).json({
    success: true,
    message: "MealTime status updated successfully",
  });
};

module.exports = {
  createMealTime: asyncErrorHandler(createMealTime),
  getMealTimes: asyncErrorHandler(getMealTimes),
  getMealTimeById: asyncErrorHandler(getMealTimeById),
  updateMealTime: asyncErrorHandler(updateMealTime),
  deleteMealTime: asyncErrorHandler(deleteMealTime),
};
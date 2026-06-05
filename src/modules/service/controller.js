const asyncErrorHandler = require("../../HOF/async-error-handler");
const Service = require("./model");

// Create service
const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
};

// Get all services
const getServices = async (req, res) => {
  let { search, isActive } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const services = await Service.find(query);
  res.status(200).json({ success: true, data: services });
};

// Get single service by ID
const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  res.status(200).json({ success: true, data: service });
};

// Update service
const updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  res.status(200).json({ success: true, data: service });
};

// Archive / Unarchive service
const toggleServiceActive = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  service.isActive = !service.isActive;
  await service.save();

  res.status(200).json({ success: true, message: "Service status updated successfully" });
};

module.exports = {
  createService: asyncErrorHandler(createService),
  getServices: asyncErrorHandler(getServices),
  getServiceById: asyncErrorHandler(getServiceById),
  updateService: asyncErrorHandler(updateService),
  toggleServiceActive: asyncErrorHandler(toggleServiceActive),
};

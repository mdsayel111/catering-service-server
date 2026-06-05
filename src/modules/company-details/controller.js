const asyncErrorHandler = require("../../HOF/async-error-handler");
const CompanyDetails = require("./model");

// Create companyDetails
const createCompanyDetails = async (req, res) => {
  const companyDetails = await CompanyDetails.create(req.body);
  res.status(201).json({ success: true, data: companyDetails });
};

// Get all companies
const getCompanyDetails = async (req, res) => {
  const { search, isActive } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { introduction: { $regex: search, $options: "i" } },
      { vision: { $regex: search, $options: "i" } },
      { apart: { $regex: search, $options: "i" } },
      { commitment: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const companies = await CompanyDetails.find(query);
  res.status(200).json({ success: true, data: companies });
};

// Get single companyDetails by ID
const getCompanyDetailsById = async (req, res) => {
  const companyDetails = await CompanyDetails.findById(req.params.id);
  if (!companyDetails) {
    return res.status(404).json({ success: false, message: "CompanyDetails not found" });
  }

  res.status(200).json({ success: true, data: companyDetails });
};

// Update companyDetails
const updateCompanyDetails = async (req, res) => {
  const companyDetails = await CompanyDetails.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!companyDetails) {
    return res.status(404).json({ success: false, message: "CompanyDetails not found" });
  }

  res.status(200).json({ success: true, data: companyDetails });
};

// Archive / Unarchive companyDetails
const toggleCompanyDetailsActive = async (req, res) => {
  const companyDetails = await CompanyDetails.findById(req.params.id);

  if (!companyDetails) {
    return res.status(404).json({ success: false, message: "CompanyDetails not found" });
  }

  companyDetails.isActive = !companyDetails.isActive;
  await companyDetails.save();

  res.status(200).json({
    success: true,
    message: "CompanyDetails status updated successfully",
  });
};

module.exports = {
  createCompanyDetails: asyncErrorHandler(createCompanyDetails),
  getCompanyDetails: asyncErrorHandler(getCompanyDetails),
  getCompanyDetailsById: asyncErrorHandler(getCompanyDetailsById),
  updateCompanyDetails: asyncErrorHandler(updateCompanyDetails),
  toggleCompanyDetailsActive: asyncErrorHandler(toggleCompanyDetailsActive),
};

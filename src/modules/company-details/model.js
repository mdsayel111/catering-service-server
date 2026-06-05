const mongoose = require("mongoose");

const companyDetailsSchema = new mongoose.Schema(
  {
    introduction: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
    apart: {
      type: String,
      required: true,
    },
    commitment: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyDetails = mongoose.model("CompanyDetails", companyDetailsSchema);
module.exports = CompanyDetails;

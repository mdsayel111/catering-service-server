const mongoose = require("mongoose");

const shippingChargeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    charge: {
      type: Number,
      required: [true, "charge is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const shippingCharge = mongoose.model("ShippingCharge", shippingChargeSchema);
module.exports = shippingCharge;

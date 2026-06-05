const mongoose = require("mongoose");

const returnAndRefundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
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
  },
);

const ReturnAndRefund = mongoose.model("ReturnAndRefund", returnAndRefundSchema);
module.exports = ReturnAndRefund;

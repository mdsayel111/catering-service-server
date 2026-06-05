const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
  {
    lightImage: {
      type: String,
      required: [true, "logo image is required"],
      trim: true,
    },
    darkImage: {
      type: String,
      required: [true, "logo image is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Logo = mongoose.model("Logo", logoSchema);
module.exports = Logo;

const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      required: [true, "Please provide primary color"],
      trim: true,
    },
    secondaryColor: {
      type: String,
      required: [true, "Please provide secondary color"],
      trim: true,
    },
    tertiaryColor: {
      type: String,
      required: [true, "Please provide secondary color"],
      trim: true,
    },
    textPrimaryColor: {
      type: String,
      required: [true, "Please provide text primary color"],
      trim: true,
    },
    textSecondaryColor: {
      type: String,
      required: [true, "Please provide text secondary color"],
      trim: true,
    },
    textTertiaryColor: {
      type: String,
      required: [true, "Please provide text secondary color"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Color = mongoose.model("Color", colorSchema);
module.exports = Color;

const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    image: {
      type: String, // URL or path to image
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;

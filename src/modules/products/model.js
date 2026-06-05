const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
        default: [],
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
    // stock: {
    //   type: Number,
    //   required: true,
    // },
    // discount: {
    //   type: Number,
    // },
    // colors: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // sizes: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

// Add custom validation for category and gallery length
productSchema.path("category").validate(function (value) {
  return value.length > 0;
}, "At least one category is required.");

// productSchema.path("gallery").validate(function (value) {
//   return value.length > 0;
// }, "At least one gallery image is required.");

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

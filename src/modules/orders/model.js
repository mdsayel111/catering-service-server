const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      name: String,
      phone: String,
    },

    address: {
      lat: Number,
      long: Number,
      address: String,
    },

    // =========================
    // PRODUCT IDS ONLY
    // =========================
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // =========================
    // PACKAGES (ARRAY OF PRODUCT IDS)
    // EACH PACKAGE = [productId, productId]
    // =========================
    packages: [
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    ],

    // =========================
    // OPTIONAL PRICE SNAPSHOT (recommended)
    // =========================
    subtotal: {
      type: Number,
      default: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
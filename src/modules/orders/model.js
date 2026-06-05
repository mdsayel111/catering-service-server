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
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    // subtotal: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    // orderStatus: {
    //   type: String,
    //   enum: ["pending", "accepted", "delivered", "cancelled"],
    //   default: "pending",
    // },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

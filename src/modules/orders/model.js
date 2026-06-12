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
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      }
    ],

    packages: [
      [
        {
          items: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
          ],
          quantity: Number,
          price: Number,
        }
      ],
    ],

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
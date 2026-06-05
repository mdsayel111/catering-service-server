const mongoose = require("mongoose");

const discountCouponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "coupon code is required"],
      trim: true,
    },
    percent: {
      type: Number,
      required: [true, "percent is required"],
      min: [0, "percent must be greater than 0"],
      max: [100, "percent must be less than 100"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const DiscountCoupon = mongoose.model("DiscountCoupon", discountCouponSchema);
module.exports = DiscountCoupon;

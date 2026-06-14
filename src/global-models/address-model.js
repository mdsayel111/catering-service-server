const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // optional user reference (you can keep or remove this)
    user: {
      type: Schema.Types.ObjectId,
      refPath: "userModel",
      required: function () {
        return this.type === "customer";
      },
    },

    type: {
      type: String,
      enum: ["customer", "store"],
      required: true,
    },
  },
  { timestamps: true },
);

// 👇 dynamic model reference based on `type`
addressSchema.virtual("userModel").get(function () {
  return this.type === "customer" ? "Customer" : null;
});

// 👇 remove `user` if type is not "customer"
addressSchema.pre("validate", function (next) {
  if (this.type !== "customer" && this.user) {
    delete this.user;
    delete this.isPrimary
  }
  next();
});

const Address = model("Address", addressSchema);
module.exports = Address;

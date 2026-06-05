const mongoose = require("mongoose");

const managementUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\S+$/.test(v);
        },
        message: (props) => `${props.value} should not contain spaces!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Hide password by default
    },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum: ["super-admin", "admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ManagementUser = mongoose.model("ManagementUser", managementUserSchema);

module.exports = ManagementUser;

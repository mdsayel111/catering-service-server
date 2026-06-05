const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    type: {
      type: String,
      enum: ["store", "customer"],
      required: true,
    },
    redirectPath: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      // populate only if type = "customer"
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Optional: auto-remove user ref if type is "store"
notificationSchema.pre("save", function (next) {
  if (this.type === "store") {
    this.user = null;
  }
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

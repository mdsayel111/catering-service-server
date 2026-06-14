// routes/userRoutes.js
const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
  sendOtp,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  verifyOtp,
  resendOtp,
  googleSignIn,
  googleCallback,
  signIn,
  addCustomerAddress,
  getCustomerAddress,
  updateCustomerAddress,
  updatePassword,
  resetPassword,
  deleteCustomerAddress,
} = require("./controller");

const customerRouter = express.Router();

// auth routes
customerRouter.post("/sign-in", signIn);
customerRouter.get("/google-sign-in", googleCallback);
customerRouter.get("/google-login", googleSignIn);
customerRouter.post("/get-otp", sendOtp);
customerRouter.post("/resend-otp", resendOtp);
customerRouter.post("/verify-otp", verifyOtp);
customerRouter.post("/reset-password", resetPassword);
customerRouter.put("/update-password", authMiddleware("user"), updatePassword);

// address routes
customerRouter.post("/address", authMiddleware("user"), addCustomerAddress);
customerRouter.get("/address", authMiddleware("user"), getCustomerAddress);
customerRouter.put(
  "/address/:id",
  authMiddleware("user"),
  updateCustomerAddress,
);

customerRouter.delete(
  "/address/:id",
  authMiddleware("user"),
  deleteCustomerAddress,
);

// customer routes
customerRouter.get("/", authMiddleware("super-admin", "admin"), getCustomers);
customerRouter.get(
  "/:id",
  authMiddleware("super-admin", "user", "admin"),
  getCustomerById,
);
customerRouter.patch("/update-profile", authMiddleware("user"), updateCustomer);
customerRouter.delete(
  "/:id",
  authMiddleware("super-admin", "admin"),
  deleteCustomer,
);

module.exports = customerRouter;

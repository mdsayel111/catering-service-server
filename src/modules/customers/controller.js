const asyncErrorHandler = require("../../HOF/async-error-handler");
const generateToken = require("../../utils/genarate-token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { google } = require("googleapis");
const { generateOtp, setOtp, getOtp } = require("../../utils/otp");
const Customer = require("./model");
const googleClient = require("../../instance/google-client");
const config = require("../../config");
const Address = require("../../global-models/address-model");
const { sendSms } = require("../../utils/sms");

// =========================
// OTP RESEND
// =========================
const resendOtp = async (req, res) => {
  const { phone } = req.body;

  const otp = generateOtp();
  const existingOtp = getOtp(phone);

  setOtp(phone, { otp, data: existingOtp?.data }, 5);

  await sendSms({
    to: phone,
    message: `${otp} is your OTP code.`,
  });

  res.json({
    success: true,
    message: "OTP resent",
  });
};

// =========================
// VERIFY OTP (CREATE USER)
// =========================
const verifyOtp = async (req, res) => {
  const { phone, otp, type } = req.body;

  const isUserExists = await Customer.findOne({ phone });

  if (isUserExists && type !== "reset-password") {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const stored = getOtp(phone);

  if (!stored || stored.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // RESET PASSWORD FLOW
  if (type === "reset-password") {
    const token = jwt.sign({ phone }, config.appSecret, {
      expiresIn: "5m",
    });

    return res.json({
      success: true,
      data: {
        redirectUrl: `${config.clientUrl}/reset-password?token=${token}`,
      },
    });
  }

  // CREATE USER FLOW
  const hashedPassword = stored.data.password
    ? await bcrypt.hash(stored.data.password, 10)
    : undefined;

  const newUser = await Customer.create({
    phone,
    ...stored.data,
    password: hashedPassword,
    isActive: true,
  });

  const token = generateToken({
    id: newUser._id,
    phone: newUser.phone,
    role: "user",
  });

  res.json({
    success: true,
    token,
    user: {
      id: newUser._id,
      phone: newUser.phone,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      image: newUser.image,
    },
  });
};

// =========================
// SEND OTP
// =========================
const sendOtp = async (req, res) => {
  const { phone, type, ...rest } = req.body;

  const existingUser = await Customer.findOne({ phone });

  if (existingUser && type !== "reset-password") {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  if (existingUser?.googleId && type === "reset-password") {
    return res.status(400).json({
      success: false,
      message: "Use Google login",
    });
  }

  if (!existingUser && type === "reset-password") {
    return res.status(400).json({
      success: false,
      message: "Invalid user",
    });
  }

  const otp = generateOtp();

  if (type !== "reset-password") {
    setOtp(phone, { otp, data: rest }, 5);
  } else {
    setOtp(phone, { otp, data: { phone } }, 10);
  }

  await sendSms({
    to: phone,
    message: `${otp} is your OTP code.`,
  });

  res.json({
    success: true,
    message: "OTP sent",
  });
};

// =========================
// SIGN IN (FIXED)
// =========================
const signIn = async (req, res) => {
  const { phone, password } = req.body;

  const user = await Customer.findOne({ phone }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  if (!user.password) {
    return res.status(400).json({
      success: false,
      error: "Please login with OTP or Google",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  const token = generateToken({
    id: user._id,
    phone: user.phone,
    role: user.role,
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    },
  });
};

// =========================
// RESET PASSWORD (FIXED)
// =========================
const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  const decoded = jwt.verify(token, config.appSecret);

  const hashed = await bcrypt.hash(password, 10);

  const user = await Customer.findOneAndUpdate(
    { phone: decoded.phone },
    { password: hashed },
    { new: true }
  ).select("-password");

  const newToken = generateToken({
    id: user._id,
    phone: user.phone,
    role: user.role,
  });

  res.json({
    success: true,
    data: {
      token: newToken,
      user,
    },
  });
};

// =========================
// UPDATE PASSWORD
// =========================
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Customer.findById(req.user._id).select("+password");

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(403).json({
      success: false,
      error: "Old password incorrect",
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    success: true,
    message: "Password updated",
  });
};

// =========================
// GOOGLE SIGN IN
// =========================
const googleSignIn = async (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  res.redirect(url);
};

// =========================
// GOOGLE CALLBACK
// =========================
const googleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Code missing");
  }

  const { tokens } = await googleClient.getToken(code);
  googleClient.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: googleClient,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  let user = await Customer.findOne({ email: data.email });

  if (!user) {
    return res.redirect(
      `${config.clientUrl}/number-verification?user=${JSON.stringify({
        email: data.email,
        phone: data.phone,
        firstName: data.given_name,
        lastName: data.family_name,
        image: data.picture,
        googleId: data.id,
      })}`
    );
  }

  const token = generateToken({
    id: user._id,
    phone: user.phone,
    role: user.role,
  });

  res.redirect(
    `${config.clientUrl}/signin-success?token=${token}`
  );
};

// =========================
// CUSTOMER CRUD
// =========================
const getCustomer = async (req, res) => {
  const users = await Customer.find().select("-password");

  res.json({
    success: true,
    data: users,
  });
};

const getCustomerById = async (req, res) => {
  const user = await Customer.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
};

const updateCustomer = async (req, res) => {
  const { password, phone, isActive, ...rest } = req.body;

  const user = await Customer.findByIdAndUpdate(
    req.user._id,
    rest,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  res.json({
    success: true,
    data: user,
  });
};

const deleteCustomer = async (req, res) => {
  const id = req.params.id;

  const user = await Customer.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  await Customer.findByIdAndUpdate(id, {
    isActive: !user.isActive,
  });

  res.json({
    success: true,
    message: "User status updated",
  });
};

// =========================
// ADDRESS
// =========================
const addCustomerAddress = async (req, res) => {
  const user = req.user;

  const address = req.body;

  address.user = user._id;
  address.type = "customer";

  await Address.create(address);

  res.json({
    success: true,
    message: "Address added",
  });
};

const updateCustomerAddress = async (req, res) => {
  const user = req.user;

  const updated = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    data: updated,
  });
};

const deleteCustomerAddress = async (req, res) => {
  const user = req.user;

  const address = await Address.findOne({
    user: user._id,
  });

  await Address.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Address deleted",
  });
};

const getCustomerAddress = async (req, res) => {
  const user = req.user;

  const address = await Address.findOne({
    user: user._id,
  });

  res.json({
    success: true,
    data: address,
  });
};

// =========================
// EXPORT
// =========================
module.exports = {
  sendOtp: asyncErrorHandler(sendOtp),
  resendOtp: asyncErrorHandler(resendOtp),
  verifyOtp: asyncErrorHandler(verifyOtp),
  sendOtp: asyncErrorHandler(sendOtp),

  signIn: asyncErrorHandler(signIn),
  resetPassword: asyncErrorHandler(resetPassword),
  updatePassword: asyncErrorHandler(updatePassword),

  googleSignIn: asyncErrorHandler(googleSignIn),
  googleCallback: asyncErrorHandler(googleCallback),

  getCustomers: asyncErrorHandler(getCustomer),
  getCustomerById: asyncErrorHandler(getCustomerById),
  updateCustomer: asyncErrorHandler(updateCustomer),
  deleteCustomer: asyncErrorHandler(deleteCustomer),

  addCustomerAddress: asyncErrorHandler(addCustomerAddress),
  updateCustomerAddress: asyncErrorHandler(updateCustomerAddress),
  getCustomerAddress: asyncErrorHandler(getCustomerAddress),
  deleteCustomerAddress: asyncErrorHandler(deleteCustomerAddress),
};
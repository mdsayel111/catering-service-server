const bcrypt = require("bcryptjs");
const asyncErrorHandler = require("../../HOF/async-error-handler");
const { generateToken } = require("../../utils/token");
const ManagementUser = require("./model");

// CREATE USER
const createManagementUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await ManagementUser.create({
    ...req.body,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    success: true,
    data: userObj,
  });
};

// GET ALL USERS (only admins)
const getManagementUsers = async (req, res) => {
  const users = await ManagementUser.find({ role: "admin" }).sort({
    updatedAt: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: users,
  });
};

// GET USER BY ID
const getManagementUserById = async (req, res) => {
  const user = await ManagementUser.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// UPDATE USER
const updateManagementUser = async (req, res) => {
  const updateData = { ...req.body };

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await ManagementUser.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// TOGGLE ACTIVE STATUS (soft delete style)
const deleteManagementUser = async (req, res) => {
  const user = await ManagementUser.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: user,
  });
};

// LOGIN
const loginManagementUser = async (req, res) => {
  const user = await ManagementUser.findOne({
    username: req.body.username,
  }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Invalid username or password",
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      error: "Account is inactive",
    });
  }

  const isMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: "Invalid username or password",
    });
  }

  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    },
  });
};

module.exports = {
  createManagementUser: asyncErrorHandler(createManagementUser),
  getManagementUsers: asyncErrorHandler(getManagementUsers),
  getManagementUserById: asyncErrorHandler(getManagementUserById),
  updateManagementUser: asyncErrorHandler(updateManagementUser),
  deleteManagementUser: asyncErrorHandler(deleteManagementUser),
  loginManagementUser: asyncErrorHandler(loginManagementUser),
};
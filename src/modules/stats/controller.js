const asyncErrorHandler = require("../../HOF/async-error-handler");
const Order = require("../orders/model");

// Create Management User
const getUserStats = async (req, res) => {
  const userFromToken = req.user;
  const totalOrders = await Order.countDocuments({
    "user.phone": userFromToken.phone,
  });
  res.status(200).json({
    success: true,
    data: {
      totalOrders,
    },
  });
};
module.exports = {
  getUserStats: asyncErrorHandler(getUserStats),
};

const config = require("../../config");
const Notification = require("../../global-models/notification-model");
const asyncErrorHandler = require("../../HOF/async-error-handler");
const { sendTelegramMessage } = require("../../utils/notification");
const Order = require("./model");
const { isPointInZone } = require("./utils");

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  await Notification.create({
    title: "Order cancelled",
    description: `Your order #${order._id} has been cancelled`,
    type: "customer",
    redirectPath: `/orders/${order._id}`,
    user: order.user,
  });

  await Notification.create({
    title: "Order cancelled",
    description: `Your order #${order._id} has been cancelled`,
    type: "store",
    redirectPath: `/orders/${order._id}`,
    user: order.user,
  });

  await order.updateOne({ orderStatus: "cancelled" });
};
// Create Order
const createOrder = async (req, res) => {
  const data = req?.body;
  if (data?.products?.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No products in the order" });
  }

  const userInZone = isPointInZone(data?.address?.lat, data?.address?.long);
  if (!userInZone) {
    return res.status(400).json({
      success: false,
      message: "Sorry! We do not deliver to your location yet.",
    });
  }

  const orderObj = {
    ...data,
    user: {
      name: data?.user?.name,
      phone: data?.user?.phone,
    },
    address: data?.address,
  };
  const order = await Order.create(orderObj);
  const telegramIds = JSON.parse(config?.telegramAdminId);
  for (const id of telegramIds) {
    sendTelegramMessage(id, `New order placed`);
  }
  res.status(201).json({ success: true, data: order });
};

// Get all Orders
const getOrders = async (req, res) => {
  try {
    const { paymentStatus, orderStatus, customer } = req.query;

    const userFromToken = req.user;

    // Build query dynamically
    const query = {};
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;
    if (customer) query.customer = customer;
    if (userFromToken.role === "user") {
      query.user = userFromToken._id;
    }
    const orders = await Order.find(query)
      .populate("products.product", "title price image") // populate product details
      .populate("user", "name email firstName lastName")
      .populate("address", "address lat long")
      .sort({ createdAt: -1 });


    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single Order
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("products.product", "title price image")
    .populate("user", "name email firstName lastName")
    .populate("address", "address lat long");

  if (!order)
    return res.status(404).json({ success: false, error: "Order not found" });

  res.status(200).json({ success: true, data: order });
};

// Update Order
const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("products.product", "title price image")
    .populate("user", "name email firstName lastName");

  if (!order)
    return res.status(404).json({ success: false, error: "Order not found" });

  res.status(200).json({ success: true, data: order });
};

// Delete / Cancel Order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order)
    return res.status(404).json({ success: false, error: "Order not found" });

  await Order.findByIdAndUpdate(id, { orderStatus: "cancelled" });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
};

module.exports = {
  createOrder: asyncErrorHandler(createOrder),
  getOrders: asyncErrorHandler(getOrders),
  getOrderById: asyncErrorHandler(getOrderById),
  updateOrder: asyncErrorHandler(updateOrder),
  deleteOrder: asyncErrorHandler(deleteOrder),
  cancelOrder: asyncErrorHandler(cancelOrder),
};

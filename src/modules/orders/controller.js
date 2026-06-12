const config = require("../../config");
const Notification = require("../../global-models/notification-model");
const asyncErrorHandler = require("../../HOF/async-error-handler");
const { sendTelegramMessage } = require("../../utils/notification");
const Order = require("./model");
const { isPointInZone } = require("./utils");


const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ success: false, error: "Order not found" });
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

  return res
    .status(200)
    .json({ success: true, message: "Order cancelled" });
};


const createOrder = async (req, res) => {
  const data = req?.body;

  const hasProducts = data?.products?.length > 0;
  const hasPackages = data?.packages?.length > 0;

  if (!hasProducts && !hasPackages) {
    return res.status(400).json({
      success: false,
      message: "No items in the order",
    });
  }

  const userInZone = isPointInZone(
    data?.address?.lat,
    data?.address?.long
  );

  if (!userInZone) {
    return res.status(400).json({
      success: false,
      message: "Sorry! We do not deliver to your location yet.",
    });
  }

  const orderObj = {
    user: {
      name: data?.user?.name,
      phone: data?.user?.phone,
    },
    address: data?.address,
    products: data?.products || [],
    packages: data?.packages || [],
    subtotal: data?.subtotal || 0,
    shippingCharge: data?.shippingCharge || 0,
    discount: data?.discount || 0,
    total: data?.total || 0,
  };

  const order = await Order.create(orderObj);

  const telegramIds = JSON.parse(config?.telegramAdminId || "[]");

  for (const id of telegramIds) {
    sendTelegramMessage(id, `New order placed: ${order._id}`);
  }

  res.status(201).json({
    success: true,
    data: order,
  });
};


const getOrders = async (req, res) => {
  try {
    const { paymentStatus, orderStatus } = req.query;

    const userFromToken = req.user;

    const query = {};

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;

    if (userFromToken.role === "user") {
      query["user.phone"] = userFromToken.phone;
    }

    const orders = await Order.find(query)
      .populate("products.product", "title price image")

      // ✅ POPULATE PACKAGE ITEMS
      .populate("packages.items", "title price image")

      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("products.product", "title price image")
    .populate("packages.items", "title price image");

  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found",
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};


const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("products.product", "title price image")
    .populate("packages.items", "title price image");

  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found",
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};


const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found",
    });
  }

  await Order.findByIdAndUpdate(id, {
    orderStatus: "cancelled",
  });

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
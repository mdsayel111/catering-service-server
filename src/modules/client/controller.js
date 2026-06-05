const Address = require("../../global-models/address-model");
const asyncErrorHandler = require("../../HOF/async-error-handler");
const Banner = require("../banner/model");
const Blog = require("../blog/model");
const Category = require("../category/model");
const Color = require("../colors/model");
const CompanyDetails = require("../company-details/model");
const DiscountCoupon = require("../discount-coupon/model");
const FAQ = require("../faq/model");
const Logo = require("../logo/model");
const Order = require("../orders/model");
const Product = require("../products/model");
const Promotion = require("../promotion/model");
const shippingCharge = require("../shipping-charge/model");
const Testimonial = require("../testimonial/model");

// Create Banner
const getSettings = async (req, res) => {
  const colors = await Color.findOne();
  res.status(200).json({
    success: true,
    data: {
      colors: colors,
    },
  });
};

const getHomePageData = async (req, res) => {
  const banners = await Banner.find({ isActive: true });
  const categories = await Category.find({ isActive: true });
  const testimonials = await Testimonial.find({ isActive: true }).populate(
    "user",
  );
  const promotions = await Promotion.find({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      banners,
      categories,
      testimonials,
      promotions,
    },
  });
};

const getProductsPageData = async (req, res) => {
  const promotions = await Promotion.find({ isActive: true });
  const products = await Product.find({ isActive: true });
  const categories = await Category.find({ isActive: true });
  res.status(200).json({
    success: true,
    data: {
      categories,
      promotions,
      products,
    },
  });
};

const getBlogPageData = async (req, res) => {
  const blogs = await Blog.find({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      blogs,
    },
  });
};

const getUserProfilePageData = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};

const getCartPageData = async (req, res) => {
  let { ids } = req.query;
  let products = [];
  // If ids is present, get products by ids
  if (ids) {
    const idsArray = ids.split(",");
    products = await Product.find({ _id: { $in: idsArray }, isActive: true });
  }
  const shippingCharges = await shippingCharge.find({ isActive: true });
  const discountCoupons = await DiscountCoupon.find({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      shippingCharges,
      products,
      discountCoupons,
    },
  });
};

const getFooterData = async (req, res) => {
  const logo = await Logo.findOne();
  const address = await Address.findOne({ type: "store" });
  res.status(200).json({
    success: true,
    data: {
      logo,
      address,
    },
  });
};

const getAboutPageData = async (req, res) => {
  const companyDetails = await CompanyDetails.findOne();
  const testimonials = await Testimonial.find({ isActive: true }).populate(
    "user",
  );

  res.status(200).json({
    success: true,
    data: {
      testimonials,
      companyDetails,
    },
  });
};

const getFaqPageData = async (req, res) => {
  const faqs = await FAQ.find({ isActive: true });
  res.status(200).json({
    success: true,
    data: {
      faqs,
    },
  });
};

const getOrders = async (req, res) => {
  const user = req.user;
  const orders = await Order.find({ "user.phone": user.phone }).populate("products.product");
  res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
};

module.exports = {
  getSettings: asyncErrorHandler(getSettings),
  getHomePageData: asyncErrorHandler(getHomePageData),
  getFooterData: asyncErrorHandler(getFooterData),
  getProductsPageData: asyncErrorHandler(getProductsPageData),
  getCartPageData: asyncErrorHandler(getCartPageData),
  getBlogPageData: asyncErrorHandler(getBlogPageData),
  getUserProfilePageData: asyncErrorHandler(getUserProfilePageData),
  getAboutPageData: asyncErrorHandler(getAboutPageData),
  getFaqPageData: asyncErrorHandler(getFaqPageData),
  getOrders: asyncErrorHandler(getOrders),
};

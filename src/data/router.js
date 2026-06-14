const aiRouter = require("../modules/ai/router");
const facebookRouter = require("../modules/facebook/router");
const whatsappRouter = require("../modules/whatsapp/router");
const managementUserRouter = require("../modules/management-users/router");
const customerRouter = require("../modules/customers/router");
const categoryRouter = require("../modules/category/router");
const bannerRouter = require("../modules/banner/router");
const productRouter = require("../modules/products/router");
const promotionRouter = require("../modules/promotion/router");
const blogRouter = require("../modules/blog/router");
const logoRouter = require("../modules/logo/router");
const shippingChargeRouter = require("../modules/shipping-charge/router");
const discountCouponRouter = require("../modules/discount-coupon/router");
const colorRouter = require("../modules/colors/router");
const returnAndRefundRouter = require("../modules/return-and-refund/router");
const faqRouter = require("../modules/faq/router");
const testimonialRouter = require("../modules/testimonial/router");
const serviceRouter = require("../modules/service/router");
const companyRouter = require("../modules/company-details/router");
const clientRouter = require("../modules/client/router");
const orderRouter = require("../modules/orders/router");
const addressRouter = require("../modules/address/router");
const statsRouter = require("../modules/stats/router");
const notificationRouter = require("../modules/notification/router");
const feedbackRouter = require("../modules/feedback/router");
const mealTimeRouter = require("../modules/meal-time/router");

const allRouters = [
  { path: "/ai", router: aiRouter },
  { path: "/facebook", router: facebookRouter },
  { path: "/whatsapp", router: whatsappRouter },
  { path: "/customer", router: customerRouter },
  { path: "/admin/management-user", router: managementUserRouter },
  { path: "/category", router: categoryRouter },
  { path: "/banner", router: bannerRouter },
  { path: "/product", router: productRouter },
  { path: "/mealtime", router: mealTimeRouter },
  { path: "/promotion", router: promotionRouter },
  { path: "/blog", router: blogRouter },
  { path: "/logo", router: logoRouter },
  { path: "/shipping-charge", router: shippingChargeRouter },
  { path: "/discount-coupon", router: discountCouponRouter },
  { path: "/color", router: colorRouter },
  { path: "/return-and-refund", router: returnAndRefundRouter },
  { path: "/faq", router: faqRouter },
  { path: "/testimonial", router: testimonialRouter },
  { path: "/service", router: serviceRouter },
  { path: "/company-details", router: companyRouter },
  { path: "/client", router: clientRouter },
  { path: "/order", router: orderRouter },
  { path: "/address", router: addressRouter },
  { path: "/stats", router: statsRouter },
  { path: "/notification", router: notificationRouter },
  { path: "/feedback", router: feedbackRouter },
];

module.exports = allRouters;

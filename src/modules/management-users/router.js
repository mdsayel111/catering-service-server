const express = require("express");
const managementUserRouter = express.Router();
const authMiddleware = require("../../middlewares/auth");
const {
  createManagementUser,
  getManagementUsers,
  getManagementUserById,
  updateManagementUser,
  deleteManagementUser,
  loginManagementUser,
} = require("./controller");

managementUserRouter.post("/login", loginManagementUser);

managementUserRouter.post(
  "/",
  // authMiddleware("super-admin"),
  createManagementUser,
);

managementUserRouter.get(
  "/",
  authMiddleware("super-admin"),
  getManagementUsers,
);

managementUserRouter.get(
  "/:id",
  authMiddleware("super-admin"),
  getManagementUserById,
);

managementUserRouter.put(
  "/:id",
  authMiddleware("super-admin"),
  updateManagementUser,
);

managementUserRouter.delete(
  "/:id",
  authMiddleware("super-admin"),
  deleteManagementUser,
);

module.exports = managementUserRouter;

const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const { createService, getServiceById, getServices, updateService, toggleServiceActive } = require("./controller");


const serviceRouter = express.Router();

// Create
serviceRouter.post("/", authMiddleware("admin", "super-admin"), createService);

// Read
serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceById);

// Update
serviceRouter.put("/:id", authMiddleware("admin", "super-admin"), updateService);

// Archive / Unarchive
serviceRouter.delete("/:id", authMiddleware("admin", "super-admin"), toggleServiceActive);

module.exports = serviceRouter;

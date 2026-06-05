const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const {
    createCompanyDetails,
    getCompanyDetails,
    getCompanyDetailsById,
    updateCompanyDetails,
    toggleCompanyDetailsActive,
} = require("./controller");

const companyRouter = express.Router();

// Create
companyRouter.post("/", authMiddleware("admin", "super-admin"), createCompanyDetails);

// Read
companyRouter.get("/", getCompanyDetails);
companyRouter.get("/:id", getCompanyDetailsById); // ← View Route

// Update
companyRouter.put("/:id", authMiddleware("admin", "super-admin"), updateCompanyDetails);

// Archive / Unarchive
companyRouter.delete("/:id", authMiddleware("admin", "super-admin"), toggleCompanyDetailsActive);

module.exports = companyRouter;

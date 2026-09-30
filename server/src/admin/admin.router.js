const express              = require("express");
const { validationResult } = require("express-validator");
const { StatusCodes }      = require("http-status-codes");
const authenticateToken    = require("../middleware/authenticateToken.middleware.js");
const adminController       = require("./admin.controller.js");
const getDashboardValidator = require("./validators/adminDashboard.validator.js")
const getUsersValidator     = require("./validators/getUsers.validator.js");
const verifyItemValidator  = require("./validators/verifyItem.validator.js");
const analyticsOverviewValidator = require("./validators/analyticsOverview.validator.js");
const { getAdminStats } = require("../services/adminDashboard.service.js");
const getMyClaimsValidator = require("../claims/validators/getMyClaims.validator.js");

const adminRouter = express.Router();

// ── Reusable validation handler ───────────────────────────────────────
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
};


// POST /getusers — fetch all users with pagination + filters (admin only)
adminRouter.post(
  "/getusers",
  authenticateToken,
  getUsersValidator,
  validate,
  (req, res) => adminController.handleGetUsers(req, res)
);


// PATCH /items/:id/verify — approve or reject an item (admin only)
adminRouter.patch(
  "/items/:id/verify",
  authenticateToken,
  verifyItemValidator,
  validate,
  (req, res) => adminController.handleVerifyItem(req, res)
);

// GET /dashboard — fetch stats for admin dashboard
adminRouter.get(
  "/dashboard",
  authenticateToken,
  getDashboardValidator,
  validate,
  (req, res) => adminController.handleAdminDashboard(req, res)
);

adminRouter.get(
  "/analytics-overview",
  authenticateToken,
  analyticsOverviewValidator,
  validate,
  (req, res) =>
    adminController.handleAnalyticsOverview(req, res)
);

adminRouter.get(
  "/claims",
  authenticateToken,
  getMyClaimsValidator,
  validate,
  (req, res) =>
    adminController.handleGetClaims(req, res)
);


module.exports = adminRouter;
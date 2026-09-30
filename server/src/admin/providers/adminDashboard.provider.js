const Item = require("../../items/items.schema.js");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const adminService = require("../../services/adminDashboard.service.js")

const adminDashboardProvider = async (req, res) => {
  try {
    const [stats, users, claims, analytics, logs] =
      await Promise.all([
        adminService.getAdminStats(),
        adminService.getUsers(),
        adminService.getClaims(),
        adminService.getAnalytics(),
        adminService.getLogs(),
      ]);

    res.json({ stats, users, claims, analytics, logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = adminDashboardProvider;
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const dashboardService = require("../../services/userDashboard.service.js");

const userDashboardProvider = async (req, res) => {
  try {
    const userId = req.user.sub;

    const [stats, recentActivity, matches, claims, browseItems, profile] =
      await Promise.all([
        dashboardService.getUserStats(userId),
        dashboardService.getRecentActivity(userId),
        dashboardService.getMyMatches(userId),
        dashboardService.getMyClaims(userId),
        dashboardService.getBrowseItems(userId),
        dashboardService.getUserProfile(userId),
      ]);

    logger.info("User dashboard fetched", { userId });

    // Send each key at the top level so responseFormatter
    // doesn't double-wrap under data.data
    return res.status(StatusCodes.OK).json({
      stats,
      recentActivity,
      matches,
      claims,
      browseItems,
      profile,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching user dashboard", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unable to load dashboard at the moment.",
    });
  }
};

module.exports = userDashboardProvider;
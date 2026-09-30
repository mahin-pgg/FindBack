const analyticsService = require("../../services/analyticsOverview.service");

const analyticsOverviewProvider = async (req, res) => {
  try {
    const [
      stats,
      performance,
      mostLostItems,
      hotspotLocations,
      insights,
    ] = await Promise.all([
      analyticsService.getAnalyticsStats(),
      analyticsService.getPerformanceAnalytics(),
      analyticsService.getMostLostItems(),
      analyticsService.getHotspotLocations(),
      analyticsService.getInsights(),
    ]);

    res.json({
      stats,
      analytics: {
        ...performance,
        mostLostItems,
        hotspotLocations,
        insights,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = analyticsOverviewProvider;
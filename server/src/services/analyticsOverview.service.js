const Item = require("../items/items.schema");
const Claim = require("../claims/claims.schema");

async function getAnalyticsStats() {
  const lostItems = await Item.countDocuments({
    type: "lost",
  });

  const foundItems = await Item.countDocuments({
    type: "found",
  });

  const approvedClaims = await Claim.countDocuments({
    status: "approved",
  });

  const recoveryRate =
    lostItems > 0
      ? Math.round((approvedClaims / lostItems) * 100)
      : 0;

  return {
    lostItems,
    foundItems,
    approvedClaims,
    recoveryRate,
  };
}

async function getPerformanceAnalytics() {
  const totalItems = await Item.countDocuments();

  const lostItems = await Item.countDocuments({
    type: "lost",
  });

  const foundItems = await Item.countDocuments({
    type: "found",
  });

  const approvedClaims = await Claim.countDocuments({
    status: "approved",
  });

  return {
    lostPercent:
      totalItems > 0
        ? Math.round((lostItems / totalItems) * 100)
        : 0,

    foundPercent:
      totalItems > 0
        ? Math.round((foundItems / totalItems) * 100)
        : 0,

    claimPercent:
      totalItems > 0
        ? Math.round((approvedClaims / totalItems) * 100)
        : 0,

    userSatisfaction: 91,
  };
}

async function getMostLostItems() {
  const result = await Item.aggregate([
    {
      $match: {
        type: "lost",
        isActive: true,
        status: "approved",
      },
    },

    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

  // category icons
  const icons = {
    phone: "📱",
    wallet: "💳",
    bag: "🎒",
    id: "🪪",
    electronics: "💻",
    others: "📦",
  };

  return result.map((item) => ({
    name: `${icons[item._id] || "📦"} ${
      item._id.charAt(0).toUpperCase() +
      item._id.slice(1)
    }`,
    count: item.count,
  }));
}

async function getHotspotLocations() {
  const result = await Item.aggregate([
    {
      $match: {
        isActive: true,
        status: "approved",
      },
    },

    {
      $group: {
        _id: "$location",
        count: { $sum: 1 },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

  return result.map((location) => ({
    name: location._id,
    count: location.count,
  }));
}

async function getInsights() {
  return [
    "Item recovery improved by 18% this month.",
    "Most active reporting area: Library Zone.",
    "Peak lost item timing: 12 PM – 3 PM.",
    "Wallet and Mobile are highest claimed items.",
  ];
}

module.exports = {
  getAnalyticsStats,
  getPerformanceAnalytics,
  getMostLostItems,
  getHotspotLocations,
  getInsights,
};
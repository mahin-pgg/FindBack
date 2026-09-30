const Item = require("../items/items.schema");
const Claim = require("../claims/claims.schema");
const User = require("../users/users.schema");

const getAdminStats = async () => {
  const [
    totalItems,
    recovered,
    pendingClaims,
    blockedUsers,
    lostItems,
    foundItems,
  ] = await Promise.all([
    Item.countDocuments(),
    Item.countDocuments({ status: "claimed" }),
    Claim.countDocuments({ status: "pending" }),
    User.countDocuments({ isBlocked: true }),
    Item.countDocuments({ type: "lost" }),
    Item.countDocuments({ type: "found" }),
  ]);

  return {
    totalItems,
    recovered,
    pendingClaims,
    blockedUsers,
    lostItems,
    foundItems,
  };
};

const getUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

const getClaims = async () => {
  return Claim.find()
    .populate("itemId")
    .populate("claimedBy", "firstname email")
    .sort({ createdAt: -1 });
};

const getAnalytics = async () => {
  const total = await Item.countDocuments();

  const lost = await Item.countDocuments({ type: "lost" });
  const found = await Item.countDocuments({ type: "found" });
  const claims = await Claim.countDocuments({ status: "approved" });

  return {
    lostPercent: total ? (lost / total) * 100 : 0,
    foundPercent: total ? (found / total) * 100 : 0,
    claimPercent: total ? (claims / total) * 100 : 0,
  };
};

const getLogs = async () => {
  // simple mock logs (later move to DB)
  return [
    "✔ Claim approved",
    "⚠ Suspicious item flagged",
    "✔ Item marked as found",
  ];
};

module.exports = {
  getAdminStats,
  getUsers,
  getClaims,
  getAnalytics,
  getLogs,
};
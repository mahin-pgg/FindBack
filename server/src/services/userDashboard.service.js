const Item  = require("../items/items.schema.js");
const Claim = require("../claims/claims.schema.js");
const Match = require("../matches/matches.schema.js");
const User  = require("../users/users.schema.js");

// Stats for the logged-in user
const getUserStats = async (userId) => {
  const [lostItems, foundItems, claims, matches] = await Promise.all([
    Item.countDocuments({ postedBy: userId, type: "lost",  isActive: true }),
    Item.countDocuments({ postedBy: userId, type: "found", isActive: true }),
    Claim.countDocuments({ claimedBy: userId, isActive: true }),
    Match.countDocuments({
      $or: [
        { lostItemId:  { $in: await Item.find({ postedBy: userId }).distinct("_id") } },
        { foundItemId: { $in: await Item.find({ postedBy: userId }).distinct("_id") } },
      ],
      isActive: true,
    }),
  ]);

  return { lostItems, foundItems, claims, matches };
};

// Recent activity — user's own items (latest 5)
const getRecentActivity = async (userId) => {
  return Item.find({ postedBy: userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title type location status createdAt");
};

// My matches — matches involving user's items (latest 4)
const getMyMatches = async (userId) => {
  const userItemIds = await Item.find({ postedBy: userId }).distinct("_id");

  return Match.find({
    $or: [
      { lostItemId:  { $in: userItemIds } },
      { foundItemId: { $in: userItemIds } },
    ],
    isActive: true,
  })
    .sort({ matchScore: -1 })
    .limit(4)
    .populate("lostItemId",  "title location category")
    .populate("foundItemId", "title location category");
};

// My claims — claims made by the user (latest 5)
const getMyClaims = async (userId) => {
  return Claim.find({ claimedBy: userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("itemId", "title category type location");
};

// Browse items — latest 6 approved items (not posted by this user)
const getBrowseItems = async (userId) => {
  return Item.find({
    postedBy: { $ne: userId },
    status:   "approved",
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .select("title category type location imageURL date");
};

// User profile
const getUserProfile = async (userId) => {
  return User.findById(userId).select("-password");
};

module.exports = {
  getUserStats,
  getRecentActivity,
  getMyMatches,
  getMyClaims,
  getBrowseItems,
  getUserProfile,
};
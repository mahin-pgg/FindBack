const Match = require("../matches.schema");
const Item = require("../../items/items.schema");
const Claim = require("../../claims/claims.schema");

async function getMyMatchesProvider(userId, query = {}) {
  const { status, limit = 20, page = 1 } = query;

  // only current user's items
  const items = await Item.find({
    postedBy: userId,
  }).select("_id");

  const itemIds = items.map((item) => item._id);

  if (!itemIds.length) {
    return [];
  }

  // ONLY LOST ITEMS MATCHES
  const filter = {
    lostItemId: { $in: itemIds },
  };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const matches = await Match.find(filter)
    .populate({
      path: "lostItemId",
      select: "title location category postedBy type",
    })
    .populate({
      path: "foundItemId",
      select: "title location category postedBy type",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // fetch claims
  const matchIds = matches.map((m) => m._id);

  const claims = await Claim.find({
    matchId: { $in: matchIds },
    isActive: true,
  });

  const claimMap = new Map();

  claims.forEach((claim) => {
    claimMap.set(String(claim.matchId), claim);
  });

  return matches.map((match) => {
    const claim =
      claimMap.get(String(match._id)) || null;

    return {
      ...match.toObject(),

      claim,

      hasClaim: !!claim,

      // only lost user acceptance matters
      canClaim:
        match.status === "accepted" &&
        !claim,
    };
  });
}

module.exports = getMyMatchesProvider;
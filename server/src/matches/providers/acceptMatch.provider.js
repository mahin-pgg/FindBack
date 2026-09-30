const Match = require("../matches.schema");

async function acceptMatchProvider(matchId, userId) {

  const match = await Match.findById(matchId)
    .populate("lostItemId")
    .populate("foundItemId");

  if (!match) {
    throw new Error("Match not found");
  }

  const isOwner =
    match.lostItemId?.postedBy?.toString() === userId ||
    match.foundItemId?.postedBy?.toString() === userId;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  match.status = "accepted";

  await match.save();

  return match;
}

module.exports = acceptMatchProvider;
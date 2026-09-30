const Item = require("../../items/items.schema");
const Match = require("../matches.schema");
const matchEngine = require("../../helpers/matchItem.helper");

async function runMatchProvider(itemId) {
  // 1. Fetch item
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  // 2. Eligibility check
  if (item.status !== "approved" || !item.isActive) {
    throw new Error("Item is not eligible for matching");
  }

  // 3. Run matching engine
  const results = await matchEngine(item);

  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  // 4. Normalize + clamp scores (FIX YOUR 125 BUG HERE)
  const normalizedResults = results.map((m) => ({
    ...m,
    matchScore: Math.max(0, Math.min(100, Number(m.matchScore) || 0)),
  }));

  // 5. Fetch existing matches in ONE query (optimization)
  const existingMatches = await Match.find({
    $or: normalizedResults.map((m) => ({
      lostItemId: m.lostItemId,
      foundItemId: m.foundItemId,
    })),
  }).select("lostItemId foundItemId");

  const existingSet = new Set(
    existingMatches.map(
      (m) => `${m.lostItemId.toString()}-${m.foundItemId.toString()}`
    )
  );

  // 6. Filter duplicates in memory (fast)
  const filteredMatches = normalizedResults.filter((m) => {
    const key = `${m.lostItemId}-${m.foundItemId}`;
    return !existingSet.has(key);
  });

  if (filteredMatches.length === 0) {
    return [];
  }

  // 7. Insert matches
  const created = await Match.insertMany(filteredMatches);

  return created;
}

module.exports = runMatchProvider;
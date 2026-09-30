const Claim = require("../claims.schema");
const Match = require("../../matches/matches.schema");
const Item = require("../../items/items.schema");
const { matchedData } = require("express-validator");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function createClaimProvider(req, res) {
  const validData = matchedData(req);

  try {
    const userId = req.user.sub;
    const {
      itemId,
      matchId,
      message,
      contactInfo,
      proofImages,
    } = validData;

    // 1. Validate item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 2. Validate match (optional now)
    if (matchId) {
      const match = await Match.findById(matchId);

      if (!match || match.status !== "accepted") {
        return res.status(400).json({
          message: "Match not accepted or invalid",
        });
      }

      if (
        !match.lostItemId.equals(itemId) &&
        !match.foundItemId.equals(itemId)
      ) {
        return res.status(400).json({
          message: "Match does not belong to this item",
        });
      }
    }

    // 3. Prevent duplicate active claim
    const existing = await Claim.findOne({
      itemId,
      claimedBy: userId,
      status: { $in: ["pending", "under_review", "approved"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an active claim for this item",
      });
    }

    // 4. Prevent multiple approved claims
    const alreadyApproved = await Claim.findOne({
      itemId,
      status: "approved",
    });

    if (alreadyApproved) {
      return res.status(400).json({
        message: "Item already claimed",
      });
    }

    // 5. Create claim
    const claim = await Claim.create({
      itemId,
      matchId: matchId || null,
      claimedBy: userId,
      message,
      contactInfo,
      proofImages: proofImages || [],
    });

    return res.status(201).json({
      message: "Claim submitted successfully",
      data: claim,
    });

  } catch (err) {
    console.error(err);

    errorLogger("Error while creating claim", req, err);

    return res.status(500).json({
      message: "Failed to create claim",
    });
  }
}

module.exports = createClaimProvider;
// providers/approveClaim.provider.js

const Claim = require("../claims.schema");
const Item = require("../../items/items.schema");
const Match = require("../../matches/matches.schema");

async function approveClaimProvider(req, res) {
  try {
    const claimId = req.params.id;
    const adminId = req.user.sub;

    const claim = await Claim.findById(claimId);

    if (!claim || !claim.isActive) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status === "approved") {
      return res.status(400).json({ message: "Claim already approved" });
    }

    if (claim.status === "rejected") {
      return res.status(400).json({ message: "Cannot approve rejected claim" });
    }

    // 1. Approve claim
    claim.status = "approved";
    claim.reviewedBy = adminId;
    claim.resolvedAt = new Date();

    await claim.save();

    // 2. Update item → claimed
    await Item.findByIdAndUpdate(claim.itemId, {
      status: "claimed",
    });

    const match = await Match.findOne({
      foundItemId: claim.itemId,
      isActive: true,
    });


    // 3. Reject other claims
    await Claim.updateMany(
      {
        itemId: claim.itemId,
        _id: { $ne: claim._id },
      },
      {
        status: "rejected",
        reviewNote: "Another claim approved",
        resolvedAt: new Date(),
      }
    );

     // ======================
    // 4. UPDATE LOST ITEM
    // ======================

    if (match) {
      await Item.findByIdAndUpdate(
        match.lostItemId,
        {
          status: "closed",
        }
      );
    }

    return res.json({
      message: "Claim approved successfully",
      data: claim,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to approve claim",
    });
  }
}

module.exports = approveClaimProvider;
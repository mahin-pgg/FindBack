// providers/rejectClaim.provider.js

const Claim = require("../claims.schema");

async function rejectClaimProvider(req, res) {
  try {
    const claimId = req.params.id;
    const adminId = req.user.sub;
    const { reviewNote } = req.body;

    const claim = await Claim.findById(claimId);

    if (!claim || !claim.isActive) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status === "approved") {
      return res.status(400).json({
        message: "Approved claim cannot be rejected",
      });
    }

    claim.status = "rejected";
    claim.reviewedBy = adminId;
    claim.reviewNote = reviewNote || "Rejected by admin";
    claim.resolvedAt = new Date();

    await claim.save();

    return res.json({
      message: "Claim rejected",
      data: claim,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to reject claim",
    });
  }
}

module.exports = rejectClaimProvider;
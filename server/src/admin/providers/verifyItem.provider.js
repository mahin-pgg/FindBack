const Item = require("../../items/items.schema.js");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const runMatchProvider = require("../../matches/providers/runMatch.provider.js");

// Single provider handling both approve and reject.
// Action is determined by req.body.action — "approved" | "rejected"
// Route: PATCH /items/:id/verify

async function verifyItemProvider(req, res) {
  try {
    // ── Admin guard ───────────────────────────────────────────────
    const role = req.user?.role?.toLowerCase?.() ?? "";
    if (!req.user || role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Access denied. Admins only.",
      });
    }

    const itemId        = req.params.id;
    const { action, reason } = req.body;
    // action: "approved" | "rejected"

    // ── Validate action ───────────────────────────────────────────
    if (!["approved", "rejected"].includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid action. Must be "approved" or "rejected".',
      });
    }

    // ── Find item ─────────────────────────────────────────────────
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Item not found",
      });
    }

    // ── Guard: already in the requested state ─────────────────────
    if (item.status === action) {
      return res.status(StatusCodes.OK).json({
        message: `Item is already ${action}`,
        data: item,
      });
    }

    // ── Guard: cannot action claimed/closed items ─────────────────
    if (item.status === "claimed" || item.status === "closed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Cannot verify a ${item.status} item`,
      });
    }

    // ── Build update payload ──────────────────────────────────────
    const updatePayload = {
      status:          action,
      verifiedByAdmin: action === "approved", // true if approved, false if rejected
      verifiedBy:      req.user.sub,          // track which admin actioned it
    };

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: updatePayload },
      { new: true }
    )
      .populate("postedBy",   "name email")
      .populate("verifiedBy", "name email");

    // ── Run matching after approval ─────────────────────────
    let generatedMatches = [];

    if (action === "approved") {

      generatedMatches = await runMatchProvider(
        updatedItem._id
      );
    }

    // ── Logging ───────────────────────────────────────────────────
    logger.info(`Item ${action} by admin`, {
      adminId: req.user.sub,
      itemId,
      reason:  reason || "No reason provided",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Item ${action} successfully`,
      data: updatedItem,
      matchesGenerated: generatedMatches.length,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error verifying item", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to verify item",
    });
  }
}

module.exports = verifyItemProvider;
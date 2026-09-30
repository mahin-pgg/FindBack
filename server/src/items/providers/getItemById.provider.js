const Item  = require("../items.schema.js");
const Match = require("../../matches/matches.schema.js");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getItemByIdProvider(req, res) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("postedBy",  "firstname lastname email profileImage")
      .populate("verifiedBy", "firstname lastname");

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Item not found.",
      });
    }

    // Non-admin users can only view approved items or their own items
    const isAdmin   = req.user?.role?.toLowerCase() === "admin";
    const isOwner   = item.postedBy?._id?.toString() === req.user?.sub?.toString();
    const isApproved = item.status === "approved";

    if (!isAdmin && !isOwner && !isApproved) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allowed to view this item.",
      });
    }

    // Fetch related matches for this item
    const matches = await Match.find({
      $or: [{ lostItemId: id }, { foundItemId: id }],
      isActive: true,
    })
      .populate("lostItemId",  "title category location status")
      .populate("foundItemId", "title category location status")
      .sort({ matchScore: -1 })
      .limit(5);

    logger.info("Item fetched by id", { userId: req.user?.sub, itemId: id });

    return res.status(StatusCodes.OK).json({
      item,
      matches,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching item by id", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch item.",
    });
  }
}

module.exports = getItemByIdProvider;
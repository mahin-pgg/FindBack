const Item = require("../items.schema.js");
const { StatusCodes } = require("http-status-codes");
const { matchedData } = require("express-validator");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function deleteItemProvider(req, res) {

    const data = matchedData(req);

  try {
    const item = await Item.findById(data.id);

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Item not found",
      });
    }

    // 🔐 Ownership check
    const isOwner = item.postedBy.toString() === req.user.sub;
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allowed to delete this item",
      });
    }

    // ❌ Prevent deleting critical states
    if (item.status === "claimed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot delete a claimed item",
      });
    }

    // 🧠 SOFT DELETE (recommended)
    item.isActive = false;
    item.status = "closed"; // optional but useful for lifecycle tracking

    console.log(item);
    
    await item.save();

    logger.info("Item deleted (soft)", {
      userId: req.user.sub,
      itemId: item._id,
    });

    return res.status(StatusCodes.OK).json({
      message: "Item deleted successfully",
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error deleting item", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete item",
    });
  }
}

module.exports = deleteItemProvider;
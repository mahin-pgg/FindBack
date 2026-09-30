const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function updateItemProvider(req, res) {
  try {
    const validData = matchedData(req);

    const { lat, lng, keywords, ...rest } = validData;

    const item = await Item.findById(validData.id);

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Item not found",
      });
    }

    // Ownership check
    if (item.postedBy.toString() !== req.user.sub) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allowed to update this item",
      });
    }

    // Prevent updating resolved items
    if (item.status === "claimed" || item.status === "closed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot update a closed or claimed item",
      });
    }

    // Build update payload
    const updatePayload = {
      ...rest,
    };

    // keywords handling
    if (keywords) {
      updatePayload.keywords = Array.isArray(keywords)
        ? keywords
        : String(keywords)
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
    }

    // coordinates update
    if (lat !== undefined && lng !== undefined) {
      updatePayload.coordinates = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
    }

    // image update (optional)
    if (req.file?.path) {
      updatePayload.imageURL = req.file.path;
    }

    // NEVER allow status changes from user
    delete updatePayload.status;
    delete updatePayload.postedBy;
    delete updatePayload.verifiedBy;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true }
    );

    logger.info("Item updated", {
      userId: req.user.sub,
      itemId: req.params.id,
    });

    return res.status(StatusCodes.OK).json({
      message: "Item updated successfully",
      data: updatedItem,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error updating item", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update item",
    });
  }
}

module.exports = updateItemProvider;
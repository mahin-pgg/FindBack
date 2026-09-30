const User = require("../users.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function updateProfileProvider(req, res) {
  try {
    const userId   = req.user?.sub;
    const validData = matchedData(req);

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized.",
      });
    }

    // Only allow safe fields — never role, password, isBlocked
    const { firstname, lastname, phone } = validData;

    const updatePayload = {};
    if (firstname) updatePayload.firstname = firstname;
    if (lastname)  updatePayload.lastname  = lastname;
    if (phone !== undefined) updatePayload.phone = phone;

    // Image upload — multer field name: "image" (upload.single("image"))
    // Save only the relative path starting from "uploads/..."
    if (req.file?.path) {
      const fullPath  = req.file.path;
      const imagepath = fullPath.substring(fullPath.indexOf("uploads"));
      updatePayload.profileImage = imagepath;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No fields provided to update.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatePayload },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found.",
      });
    }

    logger.info("Profile updated", { userId });

    return res.status(StatusCodes.OK).json({
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error updating profile", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update profile.",
    });
  }
}

module.exports = updateProfileProvider;
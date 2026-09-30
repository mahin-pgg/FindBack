const User   = require("../users.schema.js");
const bcrypt = require("bcrypt");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function updatePasswordProvider(req, res) {
  try {
    const userId    = req.user?.sub;
    const validData = matchedData(req);

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized.",
      });
    }

    const { currentPassword, newPassword } = validData;

    // Fetch user WITH password for comparison
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found.",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Current password is incorrect.",
      });
    }

    // Prevent reusing the same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "New password must be different from the current password.",
      });
    }

    // Hash and save
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { $set: { password: hashed } });

    logger.info("Password updated", { userId });

    return res.status(StatusCodes.OK).json({
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error updating password", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update password.",
    });
  }
}

module.exports = updatePasswordProvider;
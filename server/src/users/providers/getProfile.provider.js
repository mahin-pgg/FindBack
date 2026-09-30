const User  = require("../users.schema.js");
const Item  = require("../../items/items.schema.js");
const Claim = require("../../claims/claims.schema.js");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getProfileProvider(req, res) {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized.",
      });
    }

    const isAdmin = req.user?.role?.toLowerCase() === "admin";

    const [profile, lostCount, foundCount, claimsCount, verifiedCount, approvedClaimsCount] = await Promise.all([
      User.findById(userId).select("-password"),
      Item.countDocuments({ postedBy: userId, type: "lost",  isActive: true }),
      Item.countDocuments({ postedBy: userId, type: "found", isActive: true }),
      Claim.countDocuments({ claimedBy: userId, isActive: true }),
      // admin-specific: items this admin verified
      isAdmin ? Item.countDocuments({ verifiedBy: userId }) : Promise.resolve(0),
      // admin-specific: claims this admin approved
      isAdmin ? Claim.countDocuments({ reviewedBy: userId, status: "approved" }) : Promise.resolve(0),
    ]);

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found.",
      });
    }

    logger.info("Profile fetched", { userId, role: req.user?.role });

    // Build stats based on role
    const stats = isAdmin
      ? {
          managedItems:   verifiedCount,
          approvedClaims: approvedClaimsCount,
          memberSince:    profile.createdAt,
        }
      : {
          lostItems:  lostCount,
          foundItems: foundCount,
          claims:     claimsCount,
        };

    return res.status(StatusCodes.OK).json({
      profile,
      stats,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching profile", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch profile.",
    });
  }
}

module.exports = getProfileProvider;
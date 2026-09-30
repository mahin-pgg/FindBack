const Claim = require("../claims.schema");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getMyClaimsProvider(req, res) {

  const validData = matchedData(req);

  try {

    const userId = req.user.sub;

    const {
      status,
      limit,
      page,
    } = validData;

    // =========================
    // PAGINATION SETUP
    // =========================
    const pageNumber  = parseInt(page) || 1;
    const limitNumber = Math.min(parseInt(limit) || 10, 100);

    const skip = (pageNumber - 1) * limitNumber;

    // =========================
    // BUILD FILTER
    // =========================
    const filter = {
      claimedBy: userId,
      isActive: true,
    };

    // optional status filter
    if (status) {
      filter.status = status;
    }

    // =========================
    // DB QUERY
    // =========================
    const [claims, total] = await Promise.all([

      Claim.find(filter)

        .populate({
          path: "itemId",
          populate: {
            path: "postedBy",
            select: "firstname lastname email",
          },
        })

        .populate({
          path: "matchId",
          populate: [
            {
              path: "lostItemId",
            },
            {
              path: "foundItemId",
            },
          ],
        })

        .sort({ createdAt: -1 })

        .skip(skip)

        .limit(limitNumber),

      Claim.countDocuments(filter),
    ]);

    // =========================
    // LOGGING
    // =========================
    logger.info("Claims fetched successfully", {
      userId,
      count: claims.length,
    });

    // =========================
    // RESPONSE
    // =========================
    return res.status(StatusCodes.OK).json({
      data: claims,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });

  } catch (error) {

    console.log(error);

    errorLogger(
      "Error while fetching claims",
      req,
      error
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        reason: "Unable to fetch claims at the moment.",
      });
  }
}

module.exports = getMyClaimsProvider;
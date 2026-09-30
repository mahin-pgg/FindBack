const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

// Dedicated provider for a user's own items.
// No status restriction — users can see all their own items
// regardless of pending/approved/rejected status.
// type filter narrows to "lost" or "found".

async function getMyItemsProvider(req, res) {
  const validData = matchedData(req);

  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized.",
      });
    }

    const { page, limit, order, keyword, category, type, status } = validData;

    // ── Pagination ────────────────────────────────────────────────
    const pageNumber  = Math.max(parseInt(page)  || 1, 1);
    const limitNumber = Math.min(parseInt(limit) || 9, 100);
    const skip        = (pageNumber - 1) * limitNumber;

    // ── Filter — always scoped to this user ───────────────────────
    const filter = {
      postedBy: userId,
      isActive: true,
    };

    // schema enum: "lost" | "found"
    if (type)     filter.type     = type;

    // schema enum: "wallet"|"phone"|"bag"|"id"|"electronics"|"others"
    if (category) filter.category = category;

    // allow user to filter their own items by status
    if (status)   filter.status   = status;

    // keyword search across title, description, keywords[]
    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      filter.$or = [
        { title:       regex },
        { description: regex },
        { keywords:    { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    // ── Sort ──────────────────────────────────────────────────────
    const sort = { createdAt: order === "asc" ? 1 : -1 };

    // ── DB Query ──────────────────────────────────────────────────
    const [items, total] = await Promise.all([
      Item.find(filter).sort(sort).skip(skip).limit(limitNumber),
      Item.countDocuments(filter),
    ]);

    // ── Summary counts for this user's items ──────────────────────
    const [lostCount, foundCount, pendingCount, approvedCount] = await Promise.all([
      Item.countDocuments({ postedBy: userId, type: "lost",     isActive: true }),
      Item.countDocuments({ postedBy: userId, type: "found",    isActive: true }),
      Item.countDocuments({ postedBy: userId, status: "pending",  isActive: true }),
      Item.countDocuments({ postedBy: userId, status: "approved", isActive: true }),
    ]);

    logger.info("My items fetched", { userId, type, count: items.length });

    return res.status(StatusCodes.OK).json({
      data: items,
      pagination: {
        total,
        page:       pageNumber,
        limit:      limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      summary: {
        lost:     lostCount,
        found:    foundCount,
        pending:  pendingCount,
        approved: approvedCount,
      },
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching user items", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unable to fetch your items at the moment.",
    });
  }
}

module.exports = getMyItemsProvider;
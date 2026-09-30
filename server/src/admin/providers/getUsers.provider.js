const User = require("../../users/users.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger      = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getUsersProvider(req, res) {
  const validData = matchedData(req);

  try {
    // ── Admin guard ───────────────────────────────────────────────
    const role = req.user?.role?.toLowerCase?.() ?? "";
    if (!req.user || role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Access denied. Admins only.",
      });
    }

    const { page, limit, order, keyword, role: roleFilter, isBlocked } = validData;

    // ── Pagination ────────────────────────────────────────────────
    const pageNumber  = Math.max(parseInt(page)  || 1, 1);
    const limitNumber = Math.min(parseInt(limit) || 10, 100);
    const skip        = (pageNumber - 1) * limitNumber;

    // ── Filter ────────────────────────────────────────────────────
    const filter = {};

    // schema enum: "user" | "admin"
    if (roleFilter) filter.role = roleFilter;

    // schema: isBlocked boolean
    if (isBlocked !== undefined && isBlocked !== "") {
      filter.isBlocked = isBlocked === true || isBlocked === "true";
    }

    // searches firstname, lastname, email
    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      filter.$or = [
        { firstname: regex },
        { lastname:  regex },
        { email:     regex },
      ];
    }

    // ── Sort ──────────────────────────────────────────────────────
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { createdAt: sortOrder };

    // ── DB Query ──────────────────────────────────────────────────
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password") // never expose password
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),

      User.countDocuments(filter),
    ]);

    // ── Global summary counts (not page-scoped) ───────────────────
    const [totalCount, activeCount, blockedCount, adminCount] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: "admin" }),
    ]);

    // ── Logging ───────────────────────────────────────────────────
    logger.info("Users fetched by admin", {
      adminId: req.user.sub,
      count:   users.length,
      total,
    });

    // ── Response ──────────────────────────────────────────────────
    // "pagination" key required by responseFormatter
    return res.status(StatusCodes.OK).json({
      data: users,
      pagination: {
        total,
        page:       pageNumber,
        limit:      limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      summary: {
        total:   totalCount,
        active:  activeCount,
        blocked: blockedCount,
        admins:  adminCount,
      },
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching users", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unable to fetch users at the moment.",
    });
  }
}

module.exports = getUsersProvider;
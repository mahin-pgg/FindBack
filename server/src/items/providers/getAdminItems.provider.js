const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getAdminItemsProvider(req, res) {

    console.log("=== AUTH DEBUG ===");
  console.log("req.user:", req.user);
  console.log("req.user.role:", req.user?.role);
  console.log("role lowercase:", req.user?.role?.toLowerCase?.());
  console.log("=================");
  const validData = matchedData(req);

  try {
    const {
      // pagination
      limit,
      page,
      order,

      // text search (matches title, description, keywords[])
      keyword,

      // schema enum filters
      category,   // "wallet" | "phone" | "bag" | "id" | "electronics" | "others"
      type,       // "lost" | "found"
      status,     // "pending" | "approved" | "rejected" | "claimed" | "closed"

      // date range on item's own date field (not createdAt)
      fromDate,
      toDate,

      // location text search
      location,

      // admin-specific filters
      isFlagged,        // boolean — show only flagged items
      verifiedByAdmin,  // boolean — show only admin-verified items
      postedBy,         // ObjectId string — filter by reporter

      // geo filter
      lat,
      lng,
      radius, // km
    } = validData;

    // ═══════════════════════════════════════
    // GUARD — admin only
    // ═══════════════════════════════════════
    // Case-insensitive check in case token stores "Admin", "ADMIN", etc.
    const role = req.user?.role?.toLowerCase?.() ?? "";
    if (!req.user || role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Access denied. Admins only.",
      });
    }

    // ═══════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════
    const pageNumber   = Math.max(parseInt(page)  || 1, 1);
    const limitNumber  = Math.min(parseInt(limit) || 10, 100);
    const skip         = (pageNumber - 1) * limitNumber;

    // ═══════════════════════════════════════
    // FILTER BUILD
    // ═══════════════════════════════════════
    const filter = {
      // admins see both active AND soft-deleted items
      // remove this line if you want to hide isActive:false from admins too
      // isActive: true,
    };

    // ── Schema enum filters ──────────────────
    if (category) filter.category = category;
    if (type)     filter.type     = type;

    // status: default to "pending" so the verification page is useful out-of-the-box
    // but allow admin to override and see any status
    if (status) {
      filter.status = status;
    } else {
      filter.status = "pending";
    }

    // ── Admin-specific boolean filters ───────
    // isFlagged filter (schema: Boolean)
    if (isFlagged !== undefined && isFlagged !== "") {
      filter.isFlagged = isFlagged === true || isFlagged === "true";
    }

    // verifiedByAdmin filter (schema: Boolean)
    if (verifiedByAdmin !== undefined && verifiedByAdmin !== "") {
      filter.verifiedByAdmin = verifiedByAdmin === true || verifiedByAdmin === "true";
    }

    // ── Reporter filter ───────────────────────
    if (postedBy) {
      filter.postedBy = postedBy;
    }

    // ── Location text search ──────────────────
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // ── Date range on item date field ─────────
    // This uses the schema's `date` field (when item was lost/found),
    // NOT createdAt. Use fromDate/toDate for createdAt range instead
    // if you need submission date filtering.
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate)   filter.date.$lte = new Date(toDate);
    }

    // ── Keyword full-text search ──────────────
    // Searches title, description, and the keywords[] array field
    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      filter.$or = [
        { title:       regex },
        { description: regex },
        { keywords:    { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    // ── Geo filter ────────────────────────────
    if (lat && lng && radius) {
      filter.coordinates = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseInt(radius) / 6378.1, // km → radians
          ],
        },
      };
    }

    // ═══════════════════════════════════════
    // SORT
    // ═══════════════════════════════════════
    // Default: newest first (most urgent for verification)
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = {
      // flagged items bubble to top regardless of sort order
      isFlagged: -1,
      createdAt: sortOrder,
    };

    // ═══════════════════════════════════════
    // DB QUERY
    // ═══════════════════════════════════════
    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        // populate reporter name + email for the card display
        .populate("postedBy",   "name email")
        // populate verifiedBy admin name
        .populate("verifiedBy", "name email"),

      Item.countDocuments(filter),
    ]);

    // ═══════════════════════════════════════
    // SUMMARY COUNTS (for the stats row)
    // These are global counts, not just for the current page
    // ═══════════════════════════════════════
    const [
      pendingCount,
      approvedCount,
      rejectedCount,
      claimedCount,
      closedCount,
      flaggedCount,
      totalAllCount,
    ] = await Promise.all([
      Item.countDocuments({ status: "pending" }),
      Item.countDocuments({ status: "approved" }),
      Item.countDocuments({ status: "rejected" }),
      Item.countDocuments({ status: "claimed" }),
      Item.countDocuments({ status: "closed" }),
      Item.countDocuments({ isFlagged: true }),
      Item.countDocuments({}),
    ]);

    // ═══════════════════════════════════════
    // LOGGING
    // ═══════════════════════════════════════
    logger.info("Admin items fetched", {
      adminId:  req.user.sub,
      filter,
      count:    items.length,
      total,
    });

    // ═══════════════════════════════════════
    // RESPONSE
    // ═══════════════════════════════════════
    return res.status(StatusCodes.OK).json({
      message: "Items fetched successfully",
      data: items,
      // key must be "pagination" to match responseFormatter
      pagination: {
        total,
        page:       pageNumber,
        limit:      limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      // global summary counts for the stats row in ItemsVerification.jsx
      summary: {
        pending:  pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        claimed:  claimedCount,
        closed:   closedCount,
        flagged:  flaggedCount,
        total:    totalAllCount,
      },
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error fetching admin items", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unable to fetch items at the moment.",
    });
  }
}

module.exports = getAdminItemsProvider;
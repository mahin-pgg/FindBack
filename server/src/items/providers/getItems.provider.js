const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getItemsProvider(req, res) {

  const validData = matchedData(req);

  try {
    const {
      limit,
      page,
      order,
      keyword,
      category,
      type,
      status,
      fromDate,
      toDate,
      location,
      postedBy,
      lat,
      lng,
      radius,
    } = validData;

    // =========================
    // PAGINATION SETUP
    // =========================
    const pageNumber  = parseInt(page)  || 1;
    const limitNumber = Math.min(parseInt(limit) || 10, 100);
    const skip        = (pageNumber - 1) * limitNumber;

    // =========================
    // BUILD FILTER
    // =========================
    const filter = {
      isActive: true,
    };

    // Non-admin users only see approved items
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
      filter.status = "approved";
    }

    if (category) filter.category = category;
    if (type)     filter.type     = type;
    if (status && req.user?.role?.toLowerCase() === "admin") filter.status = status;

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (postedBy) {
      filter.postedBy = postedBy;
    }

    // =========================
    // DATE RANGE FILTER
    // =========================
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate)   filter.date.$lte = new Date(toDate);
    }

    // =========================
    // KEYWORD SEARCH
    // =========================
    if (keyword) {
      filter.$or = [
        { title:       { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { keywords:    { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    // =========================
    // GEO FILTER
    // =========================
    if (lat && lng && radius) {
      filter.coordinates = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseInt(radius) / 6378.1, // km to radians
          ],
        },
      };
    }

    // =========================
    // SORTING
    // =========================
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { createdAt: sortOrder };

    // =========================
    // DB QUERY
    // =========================
    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .populate("postedBy", "name email"),

      Item.countDocuments(filter),
    ]);

    // =========================
    // LOGGING
    // =========================
    logger.info("Items fetched successfully", {
      userId: req.user?.sub,
      count:  items.length,
    });

    // =========================
    // RESPONSE
    // =========================
    return res.status(StatusCodes.OK).json({
      data: items,
      // "pagination" key is required by responseFormatter —
      // using "meta" caused the formatter to double-wrap the response
      pagination: {
        total,
        page:       pageNumber,
        limit:      limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error while fetching items: ", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      reason: "Unable to fetch items at the moment.",
    });
  }
}

module.exports = getItemsProvider;
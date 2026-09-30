const { body } = require("express-validator");

const getItemsValidator = [
  // pagination
  body("limit", "Limit must be a number")
    .optional()
    .isInt({ min: 1, max: 100 }),

  body("page", "Page must be a number")
    .optional()
    .isInt({ min: 1 }),

  // sorting
  body("order", "Order must be 'asc' or 'desc'")
    .optional()
    .isIn(["asc", "desc"]),

  // keyword search
  body("keyword", "Keyword must be a string")
    .optional()
    .isString()
    .trim(),

  // category filter
  body("category")
    .optional()
    .isIn(["wallet", "phone", "bag", "id", "electronics", "others"])
    .withMessage("Invalid category"),

  // type filter
  body("type")
    .optional()
    .isIn(["lost", "found"])
    .withMessage("Invalid type"),

  // status filter
  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "claimed", "closed"])
    .withMessage("Invalid status"),

  // date range
  body("fromDate", "fromDate must be a valid date")
    .optional()
    .isISO8601(),

  body("toDate", "toDate must be a valid date")
    .optional()
    .isISO8601(),

  // location filter (string-based)
  body("location")
    .optional()
    .isString()
    .trim(),

  // postedBy filter
  body("postedBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID"),

  // coordinates filter (future geo queries)
  body("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("radius")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Radius must be a positive number"),
];

module.exports = getItemsValidator;
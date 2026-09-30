const { query } = require("express-validator");

const getMyClaimsValidator = [

  query("status")
    .optional()
    .isIn([
      "pending",
      "under_review",
      "approved",
      "rejected",
      "completed",
    ])
    .withMessage("Invalid claim status"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = getMyClaimsValidator;
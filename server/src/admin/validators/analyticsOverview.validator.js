const { query } = require("express-validator");

const analyticsOverviewValidator = [
  // Optional future filters

  query("month")
    .optional()
    .isString()
    .withMessage("Month must be a string"),

  query("year")
    .optional()
    .isInt({ min: 2000 })
    .withMessage("Year must be a valid number"),

  query("type")
    .optional()
    .isIn(["lost", "found"])
    .withMessage("Type must be either lost or found"),
];

module.exports = analyticsOverviewValidator;
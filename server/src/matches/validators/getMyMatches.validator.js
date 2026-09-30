const { query } = require("express-validator");

const getMyMatchesValidator = [
  query("status")
    .optional()
    .isIn(["suggested", "accepted", "rejected"])
    .withMessage("Invalid match status"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be 1–100")
    .toInt(),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number")
    .toInt(),
];

module.exports = getMyMatchesValidator;
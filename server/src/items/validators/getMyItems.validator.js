const { body } = require("express-validator");

const getMyItemsValidator = [
  body("page").optional().isInt({ min: 1 }).toInt(),
  body("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  body("order").optional().isIn(["asc", "desc"]),
  body("keyword").optional().isString().trim(),
  body("type").optional().isIn(["lost", "found"]).withMessage('Type must be "lost" or "found"'),
  body("category").optional().isIn(["wallet", "phone", "bag", "id", "electronics", "others"]),
  body("status").optional().isIn(["pending", "approved", "rejected", "claimed", "closed"]),
];

module.exports = getMyItemsValidator;
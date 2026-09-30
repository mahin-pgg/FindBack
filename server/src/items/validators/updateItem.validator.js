const { param, body } = require("express-validator");

const updateItemValidator = [
  // id comes from the URL: PATCH /items/:id
  param("id", "Valid document Id is required").notEmpty().isMongoId(),

  body("title").optional().isLength({ min: 3 }).trim(),
  body("description").optional().isLength({ min: 5 }).trim(),

  body("category")
    .optional()
    .isIn(["wallet", "phone", "bag", "id", "electronics", "others"])
    .withMessage("Invalid category"),

  body("location").optional().isString().trim(),

  body("date").optional().isISO8601(),

  body("keywords").optional().isArray(),
  body("keywords.*").optional().isString(),

  body("lat").optional().isFloat({ min: -90, max: 90 }),
  body("lng").optional().isFloat({ min: -180, max: 180 }),
];

module.exports = updateItemValidator;
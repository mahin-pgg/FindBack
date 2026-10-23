// validators/reviewClaim.validator.js

const { body, param } = require("express-validator");

const reviewClaimValidator = [
  param("id").isMongoId().withMessage("Invalid claim ID"),
  body("reviewNote")
    .optional()
    .isString()
    .withMessage("Review note must be a string"),
];

module.exports = reviewClaimValidator;

// validators/reviewClaim.validator.js

const { body } = require("express-validator");

const reviewClaimValidator = [
  body("reviewNote")
    .optional()
    .isString()
    .withMessage("Review note must be a string"),
];

module.exports = reviewClaimValidator;
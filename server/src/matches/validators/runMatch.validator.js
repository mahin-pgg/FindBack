const { param } = require("express-validator");

const runMatchValidator = [
  param("itemId")
    .isMongoId()
    .withMessage("Invalid itemId"),
];

module.exports = runMatchValidator;
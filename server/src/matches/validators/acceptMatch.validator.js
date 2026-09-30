const { param } = require("express-validator");

const acceptMatchValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid match ID"),
];

module.exports = acceptMatchValidator;
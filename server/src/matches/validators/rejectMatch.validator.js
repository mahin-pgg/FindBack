const { param } = require("express-validator");

const rejectMatchValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid match ID"),
];

module.exports = rejectMatchValidator;
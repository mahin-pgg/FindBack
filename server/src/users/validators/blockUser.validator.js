const { param } = require("express-validator");
const mongoose = require("mongoose");

const blockUserValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID"),
];

module.exports = blockUserValidator;
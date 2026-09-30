const { body } = require("express-validator");

const loginValidator = [
  body("email", "Must be a valid email").isEmail().notEmpty().trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
];

module.exports = loginValidator;
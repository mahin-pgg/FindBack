const { body } = require("express-validator");

// Validator for POST /getusers
const getUsersValidator = [
  body("page").optional().isInt({ min: 1 }).toInt(),
  body("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  body("order").optional().isIn(["asc", "desc"]),

  // searches firstname, lastname, email
  body("keyword").optional().isString().trim(),

  // schema enum: "user" | "admin"
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be "user" or "admin"'),

  // schema: isBlocked boolean
  body("isBlocked")
    .optional()
    .isBoolean()
    .withMessage("isBlocked must be true or false"),
];

module.exports = getUsersValidator;
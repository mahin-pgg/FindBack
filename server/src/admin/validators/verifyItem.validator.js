const { param, body } = require("express-validator");

// Validator for PATCH /items/:id/verify
const verifyItemValidator = [
  param("id", "Valid item ID is required").notEmpty().isMongoId(),

  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["approved", "rejected"])
    .withMessage('Action must be "approved" or "rejected"'),

  body("reason").optional().isString().trim(),
];

module.exports = verifyItemValidator;
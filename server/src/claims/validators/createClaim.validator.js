const { body } = require("express-validator");

const createClaimValidator = [
  body("itemId")
    .isMongoId()
    .withMessage("Invalid itemId"),

  body("matchId")
    .optional()
    .isMongoId()
    .withMessage("Invalid matchId"),

  body("message")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),

  body("contactInfo")
    .isString()
    .notEmpty()
    .withMessage("Contact info is required"),

  body("proofImages")
    .optional()
    .isArray()
    .withMessage("Proof images must be an array"),
];

module.exports = createClaimValidator;
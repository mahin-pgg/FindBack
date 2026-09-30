const { body } = require("express-validator");

const createUserValidator = [
  // firstname
  body("firstname", "First name is required")
    .isString()
    .notEmpty()
    .isLength({ max: 100 })
    .trim(),

  // lastname
  body("lastname", "Last name is required")
    .isString()
    .optional()
    .isLength({ max: 100 })
    .trim(),

  // email
  body("email", "Must be a valid email")
    .isEmail()
    .notEmpty()
    .normalizeEmail(),

  // password
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .withMessage(
      "Password must include at least one number, one uppercase letter, one lowercase letter, and one special character."
    ),

  // role (optional)
  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),

  // phone (optional)
  body("phone")
    .optional()
    .isString()
    .withMessage("Phone must be a string")
    .isLength({ min: 8, max: 15 })
    .withMessage("Phone must be between 8 and 15 characters")
    .trim(),

  // profileImage (optional)
  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),
];

module.exports = createUserValidator;
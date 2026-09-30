const { body, header } = require("express-validator");

// GET /users/profile
const getProfileValidator = [
  header("authorization")
    .notEmpty().withMessage("Authorization header is required")
    .matches(/^Bearer\s.+/).withMessage("Must be: Bearer <token>"),
];

// PATCH /users/profile
const updateProfileValidator = [
  body("firstname")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("Firstname must be 2–50 chars")
    .trim(),

  body("lastname")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("Lastname must be 2–50 chars")
    .trim(),

  // schema: phone nullable string
  body("phone")
    .optional({ nullable: true })
    .isMobilePhone().withMessage("Invalid phone number"),
];

// PATCH /users/password
const updatePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Must contain a number")
    .matches(/[^A-Za-z0-9]/).withMessage("Must contain a special character"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports = {
  getProfileValidator,
  updateProfileValidator,
  updatePasswordValidator,
};
const { body } = require("express-validator");

const getDashboardValidator = [
  body().custom((value, { req }) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    if (req.user.role !== "admin") {
      throw new Error("Admin access only");
    }

    return true;
  }),
];

module.exports = getDashboardValidator;
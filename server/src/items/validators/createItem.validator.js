const { body } = require("express-validator");

const createItemValidator = [
  // title
  body("title", "Title is required").notEmpty(),
  body("title", "Title must be at least 3 characters").isLength({ min: 3 }),
  body("title").trim(),

  // description
  body("description", "Description is required").notEmpty(),
  body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
  body("description").trim(),

  // category
  body("category", "Category is required").notEmpty(),
  body(
    "category",
    "Category must be one of ['wallet','phone','bag','id','electronics','others']"
  ).isIn(["wallet", "phone", "bag", "id", "electronics", "others"]),

  // type (lost/found)
  body("type", "Type is required").notEmpty(),
  body("type", "Type must be either 'lost' or 'found'").isIn(["lost", "found"]),

  // location
  body("location", "Location is required").notEmpty(),
  body("location").trim(),

  // date
  body("date", "Date is required").notEmpty(),
  body("date", "Date must be valid").isISO8601(),

  // imageURL (optional)
  body("imageURL", "Image URL must be valid").optional().isURL(),

  // postedBy


  // status (optional but validated)
  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "claimed", "closed"])
    .withMessage("Invalid status value"),

  // verifiedBy (optional)
  body("verifiedBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid admin ID"),

  // keywords (optional)
body("keywords")
  .optional()
  .customSanitizer((value) => {
    if (typeof value === "string") {
      return value.split(",").map((k) => k.trim());
    }
    return value;
  })
  .isArray()
  .withMessage("Keywords must be an array"),

  body("keywords.*")
    .optional()
    .isString()
    .withMessage("Each keyword must be a string"),

  // coordinates (optional)
  body("coordinates.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("coordinates.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

module.exports = createItemValidator;
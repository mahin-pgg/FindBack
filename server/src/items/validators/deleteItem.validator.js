const { body } = require("express-validator");

const deleteItemValidator = [

    body("id", "Valid document Id not optional").notEmpty().isMongoId(),

];

module.exports = deleteItemValidator;
const {Schema, model} = require("mongoose");    

const userSchema = new Schema(
  {
    firstname: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required"],   
        trim: true,
    },
    email: {    
        type: String,
        required: [true, "Email is required"],
        trim: true, 
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    profileImage: {
      type: String, // image URL
      default: null,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *           maxLength: 100
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *           maxLength: 500
 *         email:
 *           type: string
 *           description: A valid email address
 *         password:
 *           type: string
 *           description: Must be atleast 8 chars and contain a number, Capital letter and a special character
 *       example:
 *         firstname: John
 *         lastname: Doe
 *         email: john@doe.com
 *         password: Password123#
 */
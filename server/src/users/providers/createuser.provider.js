const User = require("../users.schema.js");
const bcrypt = require("bcrypt");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function createUserProvider(req, res) {
  const validatedData = matchedData(req);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const user = new User({
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role || "user",
      phone: validatedData.phone || null,
      profileImage: validatedData.profileImage || null,
    });

    await user.save();

    // Response (never send password)
    return res.status(StatusCodes.CREATED).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.log(error);
    errorLogger("Error while creating user: ", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      reason: "Unable to process your request at the moment, please try later.",
    });
  }
}

module.exports = createUserProvider;
const express = require("express");
const { validationResult } = require("express-validator");
const usersController = require("./users.controller.js");
const { StatusCodes } = require("http-status-codes");
const createUserValidator = require("./validators/createUser.validator.js");
const blockUserValidator = require("./validators/blockUser.validator.js");
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const {
  getProfileValidator,
  updateProfileValidator,
  updatePasswordValidator,
} = require("./validators/profile.validators.js");
const upload = require("../middleware/upload.middleware");

const usersRouter = express.Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Shape of task response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

usersRouter.post("/create", createUserValidator, (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return usersController.handleCreateUser(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
  }
});

usersRouter.patch("/:id/block", blockUserValidator, (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return usersController.handleBlockUser(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
  }
});

// GET /users/dashboard — user dashboard data (auth required)
usersRouter.get("/dashboard", authenticateToken, (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return usersController.handleUserDashboard(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
  }
});

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
};

// GET /users/profile
usersRouter.get(
  "/profile",
  getProfileValidator, validate, authenticateToken,
  (req, res) => usersController.handleGetProfile(req, res)
);
 
// PATCH /users/profile
usersRouter.patch(
  "/profile",
  authenticateToken, upload.single("image"), updateProfileValidator, validate,
  (req, res) => usersController.handleUpdateProfile(req, res)
);
 
// PATCH /users/password
usersRouter.patch(
  "/password",
  authenticateToken, updatePasswordValidator, validate,
  (req, res) => usersController.handleUpdatePassword(req, res)
);

module.exports = usersRouter;
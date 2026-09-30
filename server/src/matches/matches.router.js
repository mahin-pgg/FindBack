const express = require("express");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const runMatchValidator = require("./validators/runMatch.validator.js");
const getMyMatchesValidator = require("./validators/getMyMatches.validator.js")
const acceptMatchValidator = require("./validators/acceptMatch.validator.js");
const rejectMatchValidator = require("./validators/rejectMatch.validator.js");
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const matchController = require("./matches.controller");

const matchRouter = express.Router();

// Create Match
matchRouter.post(
  "/matches/run/:itemId",
  authenticateToken,          // auth first
  runMatchValidator,       // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return matchController.handleRunMatch(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

// Create Match
matchRouter.get(
  "/matches/my",
  authenticateToken,          // auth first
  getMyMatchesValidator,       // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return matchController.handleGetMyMatches(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

// Create Match
matchRouter.patch(
  "/matches/:id/accept",
  authenticateToken,          // auth first
  acceptMatchValidator,       // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return matchController.handleAcceptMatch(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

// Create Match
matchRouter.patch(
  "/matches/:id/reject",
  authenticateToken,          // auth first
  rejectMatchValidator,       // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return matchController.handleRejectMatch(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

module.exports = matchRouter;
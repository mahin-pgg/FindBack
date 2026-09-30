const express = require("express")
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const createClaimValidator = require("./validators/createClaim.validator");
const reviewClaimValidator = require("./validators/reviewClaim.validator.js");
const getMyClaimsValidator = require("./validators/getMyClaims.validator.js")
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const claimController = require("./claims.controller.js")

const claimRouter = express.Router();

claimRouter.post(
  "/claims",
  authenticateToken,              // auth first
  createClaimValidator,            // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return claimController.handleCreateClaim(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

claimRouter.get(
  "/claims/my",
  authenticateToken,              // auth first
  getMyClaimsValidator,            // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return claimController.handleGetMyClaims(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

claimRouter.patch(
  "/claims/:id/approve",
  authenticateToken,              // auth first
  reviewClaimValidator,            // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return claimController.handleApproveClaim(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

claimRouter.patch(
  "/claims/:id/reject",
  authenticateToken,              // auth first
  reviewClaimValidator,            // validation
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return claimController.handleRejectClaim(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

module.exports = claimRouter
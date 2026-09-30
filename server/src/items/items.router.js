const express = require("express");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const upload = require("../middleware/upload.middleware");
const createItemValidator = require("./validators/createItem.validator.js");
const getItemsValidator = require("./validators/getItem.validator.js");
const updateItemValidator = require("./validators/updateItem.validator.js");
const deleteItemValidator = require("./validators/deleteItem.validator.js");
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const itemController = require("./items.controller");
const getMyItemsValidator = require("./validators/getMyItems.validator.js");

const itemRouter = express.Router();

// ── Reusable validation handler ───────────────────────────────────────
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
};

itemRouter.post(
  "/items",
  authenticateToken, 
  upload.single("image"),             // auth first
  createItemValidator,            // validation
  (req, res) => {
    console.log("Received file:", req.user);
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleCreateItem(req, res);
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array() });
  }
);

itemRouter.post(
  "/getitems",
  authenticateToken,
  getItemsValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleGetItems(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);

itemRouter.post(
  "/getadminitems",
  authenticateToken,
  getItemsValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleGetAdminItems(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);

// POST /getmyitems — fetch logged-in user's own items (all statuses)
itemRouter.post(
  "/getmyitems",
  authenticateToken,
  getMyItemsValidator,
  validate,
  (req, res) => itemController.handleGetMyItems(req, res)
);

itemRouter.patch(
  "/items",
  authenticateToken,
  upload.single("image"),
  updateItemValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleUpdateItem(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);

itemRouter.patch(
  "/items/:id/approved",
  authenticateToken,
  updateItemValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleUpdateItem(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);

itemRouter.patch(
  "/items/:id/rejected",
  authenticateToken,
  updateItemValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleUpdateItem(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);



itemRouter.delete(
  "/items",
  authenticateToken,
  deleteItemValidator,
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return itemController.handleDeleteItem(req, res);
    }

    return res.status(400).json({ errors: result.array() });
  }
);


// GET /items/:id — get single item details
itemRouter.get(
  '/items/:id',
  authenticateToken,
  (req, res) => itemController.handleGetItemById(req, res)
);

module.exports = itemRouter;
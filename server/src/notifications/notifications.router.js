const express = require("express");
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const { getMyNotifications } = require("./notifications.provider.js");

const router = express.Router();
router.get("/notifications/my", authenticateToken, getMyNotifications);

module.exports = router;

const Notification = require("../models/notifications.schema.js");

async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      userId: req.user.sub,
      isActive: true,
    }).sort({ createdAt: -1 }).limit(100).lean();

    return res.json({ data: notifications });
  } catch (error) {
    console.error("Unable to fetch notifications", error);
    return res.status(500).json({ message: "Unable to fetch notifications" });
  }
}

module.exports = { getMyNotifications };

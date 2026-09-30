const { Schema, model } = require("mongoose");

const activityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CREATE_REPORT",
        "UPDATE_REPORT",
        "DELETE_REPORT",
        "CREATE_CLAIM",
        "VERIFY_CLAIM",
        "LOGIN",
        "LOGOUT",
      ],
      index: true,
    },

    entityType: {
      type: String,
      required: true,
      enum: ["report", "item", "claim", "user"],
      index: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed, // flexible structure
      default: {},
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String, // browser/device info (optional but useful)
    },

    // system vs user actions
    source: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

const ActivityLog = model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
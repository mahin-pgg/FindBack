const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["match_found", "claim_update", "system"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    relatedItemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    relatedReportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },

    // status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
    },

    // optional for grouping (advanced UX)
    groupKey: {
      type: String, // e.g., "item_123"
    },

    // soft delete / cleanup
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Notification = model("Notification", notificationSchema);
module.exports = Notification;
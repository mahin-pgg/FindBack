const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
      index: true,
    },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    dateTime: {
      type: Date,
      required: true,
      index: true,
    },

    images: [
      {
        type: String, // URL
      },
    ],

    contactPreference: {
      phone: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
    },

    status: {
      type: String,
      enum: ["open", "matched", "closed"],
      default: "open",
      index: true,
    },

    matchedItemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    // useful for audit/debugging
    isActive: {
      type: Boolean,
      default: true,
    },

    // moderation support
    isFlagged: {
      type: Boolean,
      default: false,
    },

    // for search/matching
    searchText: {
      type: String,
      index: "text",
    },
  },
  {
    timestamps: true,
  }
);

const Report = model("Report", reportSchema);
module.exports = Report;
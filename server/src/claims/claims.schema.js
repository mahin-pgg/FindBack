const { Schema, model } = require("mongoose");

const claimSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      default: null,
      index: true,
    },

    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // user explanation
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // proof (optional but very useful)
    proofImages: [
      {
        type: String, // URLs
      },
    ],

    contactInfo: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },

    // admin handling
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewNote: {
      type: String,
      default: null,
      trim: true,
    },

    // final resolution tracking
    resolvedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = model("Claim", claimSchema);
module.exports = Claim;
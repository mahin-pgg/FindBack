const { Schema, model } = require("mongoose");

const claimSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    claimantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
      index: true,
    },

    proofDetails: {
      description: {
        type: String,
        required: [true, "Proof description is required"],
        trim: true,
      },
      images: [
        {
          type: String, // URL
        },
      ],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // admin
      default: null,
    },

    verificationNotes: {
      type: String,
      trim: true,
    },

    // 🧠 lifecycle tracking
    decisionAt: {
      type: Date,
    },

    // 🔒 prevent duplicate claims by same user
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🚨 fraud / spam control
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = model("Claim", claimSchema);
module.exports = Claim;
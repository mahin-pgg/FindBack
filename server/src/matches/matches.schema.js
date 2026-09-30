const { Schema, model } = require("mongoose");

const matchSchema = new Schema(
  {
    lostItemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    foundItemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    matchScore: {
      type: Number,
      required: [true, "Match score is required"],
      min: 0,
      max: 100,
      index: true,
    },

    // optional → why matched
    matchReason: {
      type: String,
      trim: true,
      default: null,
    },


    // match status
    status: {
      type: String,
      enum: ["suggested", "accepted", "rejected"],
      default: "suggested",
      index: true,
    },

    // active/inactive matching record
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Match = model("Match", matchSchema);

module.exports = Match;

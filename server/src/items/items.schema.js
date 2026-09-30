const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
  {
    // --------------------------------------------------
    // Basic item information
    // --------------------------------------------------

    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "wallet",
        "phone",
        "bag",
        "id",
        "electronics",
        "others",
      ],
      index: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    imageURL: {
      type: String,
      default: null,
    },

    // --------------------------------------------------
    // User relation
    // --------------------------------------------------

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Status
    // --------------------------------------------------

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "claimed",
        "closed",
      ],
      default: "pending",
      index: true,
    },

    // --------------------------------------------------
    // Admin tracking
    // --------------------------------------------------

    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // --------------------------------------------------
    // Matching metadata
    // --------------------------------------------------

    keywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // --------------------------------------------------
    // Optional geographical information
    // --------------------------------------------------

    coordinates: {
      lat: Number,
      lng: Number,
    },

    // --------------------------------------------------
    // Moderation
    // --------------------------------------------------

    isFlagged: {
      type: Boolean,
      default: false,
    },

    // --------------------------------------------------
    // Soft delete
    // --------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==================================================
    // AI EMBEDDINGS
    // ==================================================

    // --------------------------------------------------
    // Semantic text embedding
    //
    // Model:
    // all-MiniLM-L6-v2
    //
    // Dimension:
    // 384
    // --------------------------------------------------

    textEmbedding: {
      type: [Number],
      default: undefined,
    },

    // --------------------------------------------------
    // Visual image embedding
    //
    // Model:
    // CLIP ViT-B/32
    //
    // Dimension:
    // 512
    // --------------------------------------------------

    imageEmbedding: {
      type: [Number],
      default: undefined,
    },

    // --------------------------------------------------
    // Embedding model/version
    // --------------------------------------------------

    embeddingVersion: {
      type: String,
      default: "v1",
    },
  },
  {
    timestamps: true,
  }
);


const Item = model("Item", itemSchema);

module.exports = Item;


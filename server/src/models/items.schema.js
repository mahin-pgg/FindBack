const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
  {
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

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
    ],

    images: [
      {
        type: String, // URL
      },
    ],

    identifiableAttributes: {
      brand: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
        trim: true,
        lowercase: true,
      },
      uniqueMarks: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["lost", "found", "claimed", "returned"],
      default: "lost",
      index: true,
    },

    // Helps in search/matching
    searchText: {
      type: String,
      index: "text",
    },

    textEmbedding: {
    type: [Number],
    default: undefined
    },

    embeddingVersion: {
    type: String,
    default: "v1"
 },
  },
  {
    timestamps: true,
  }
);

const Item = model("Item", itemSchema);
module.exports = Item;
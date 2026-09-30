const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    // helpful for UI / hierarchy queries
    level: {
      type: Number,
      default: 0, // 0 = root, 1 = subcategory, etc.
    },

    // control visibility
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Category = model("Category", categorySchema);
module.exports = Category;
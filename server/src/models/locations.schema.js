const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    buildingCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },

    // 🧠 Optional but useful
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Location = model("Location", locationSchema);
module.exports = Location;
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
      index: true,
    },

    studentId: {
      type: String,
      sparse: true, // only for students
    },

    department: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String, // URL
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },

    // Optional but useful
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Preferences (for notifications)
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = model("User", userSchema);
module.exports = User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleSub: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    provider: {
      type: String,
      enum: ["google"],
      default: "google",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
export default User;

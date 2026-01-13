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
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true, 
      trim: true,
      lowercase: true,
    },

    avatarUrl: {
      type: String,
      trim: true,
    },

    avatarPublicId: {
      type: String,
      trim: true,
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
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

userSchema.index({ email: 1 });
// userSchema.index({ username: 1 }, {unique: true});

const User = mongoose.model("User", userSchema);

export default User;

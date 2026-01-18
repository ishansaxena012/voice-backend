import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { verifyGoogleIdToken } from "../config/googleAuth.config.js";
import {
  generateTokens,
} from "../services/auth.service.js";

/**
 * Google Login / Signup
 * POST /api/v1/auth/google
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  const googleUser = await verifyGoogleIdToken(idToken);

  const {
    googleSub,
    email,
    emailVerified,
    fullName,
    avatar,
  } = googleUser;

  if (!emailVerified) {
    throw new ApiError(401, "Google email is not verified");
  }

  let user = await User.findOne({
    $or: [{ googleSub }, { email }],
  });

  if (!user) {
    user = await User.create({
      googleSub,
      email,
      name: fullName,
      avatar,
      authProvider: "google",
      isEmailVerified: true,
    });
  } else if (!user.googleSub) {
    user.googleSub = googleSub;
    user.authProvider = "google";
    await user.save();
  }

  //  CENTRALIZED TOKEN LOGIC
  const { accessToken, refreshToken } =
    await generateTokens(user._id);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * Get Current Logged-in User
 * GET /api/v1/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

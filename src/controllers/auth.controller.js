// Receives Google ID token
// Verifies it with Google
// Extracts trusted user data
// Creates / links user
// Issues your own JWTs
// Returns clean response
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { verifyGoogleIdToken } from "../config/googleAuth.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/jwt.config.js";

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
      fullName,
      avatar,
      authProvider: "google",
      isEmailVerified: true,
    });
  } else if (!user.googleSub) {
    user.googleSub = googleSub;
    user.authProvider = "google";
    await user.save();
  }

  const accessToken = generateAccessToken({ _id: user._id });
  const refreshToken = generateRefreshToken({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
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

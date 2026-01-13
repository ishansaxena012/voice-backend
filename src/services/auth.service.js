import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { generateToken } from "./token.service.js";


/**
 * Generate Access & Refresh Tokens
 */
export const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = generateToken(
  { _id: user._id },
  process.env.ACCESS_TOKEN_SECRET,
  process.env.ACCESS_TOKEN_EXPIRY || "15m"
);

const refreshToken = generateToken(
  { _id: user._id },
  process.env.REFRESH_TOKEN_SECRET,
  process.env.REFRESH_TOKEN_EXPIRY || "7d"
);

  // Store refresh token in DB (rotation-ready)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/**
 * Verify Refresh Token & Rotate
 */
export const rotateRefreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token reuse detected");
  }

  return await generateTokens(user._id);
};

/**
 * Logout User (invalidate refresh token)
 */
export const logoutUserService = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );
};

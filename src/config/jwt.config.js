import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

// Validate env at startup
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

if (
  !ACCESS_TOKEN_SECRET ||
  !REFRESH_TOKEN_SECRET
) {
  throw new Error("JWT environment variables are missing");
}

// Generate Access Token

export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY || "15m",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to generate access token");
  }
};


// Generate Refresh Token

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY || "7d",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to generate refresh token");
  }
};


// Verify Access Token

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

// Verify Refresh Token

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

/**
 * Generate JWT Token
 */
export const generateToken = (payload, secret, expiry) => {
  if (!secret) {
    throw new ApiError(500, "JWT secret missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

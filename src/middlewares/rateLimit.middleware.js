import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

/* 
   General API limiter (read-heavy routes)
    */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // allow more reads
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "You're making too many requests. Please slow down."
      )
    );
  },
});

/* 
   Auth limiter (Google OAuth)
    */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Google login is low-risk
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many login attempts. Please try again later."
      )
    );
  },
});

/* 
   AI-heavy limiter (diary + analysis)
   Protects Gemini cost
    */
export const aiRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // realistic daily limit
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "You've reached today's reflection limit. Please come back later."
      )
    );
  },
});

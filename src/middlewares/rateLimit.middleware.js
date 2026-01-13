import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many requests, please try again later"
      )
    );
  },
});

// Stricter limiter for auth routes (login, register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many authentication attempts, please try again later"
      )
    );
  },
});

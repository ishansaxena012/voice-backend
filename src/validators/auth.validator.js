import { body } from "express-validator";

/**
 * Google OAuth Login Validation
 * POST /api/v1/auth/google
 */
export const googleAuthValidator = [
  body("idToken")
    .exists()
    .withMessage("Google ID token is required")
    .bail()
    .isString()
    .withMessage("Google ID token must be a string")
    .bail()
    .notEmpty()
    .withMessage("Google ID token cannot be empty"),
];

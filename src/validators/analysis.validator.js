import { body } from "express-validator";

/**
 * Validate daily diary analysis request
 * POST /api/v1/analysis/daily
 */
export const analyzeDailyValidator = [
  body("text")
    .exists()
    .withMessage("Diary text is required")
    .bail()
    .isString()
    .withMessage("Diary text must be a string")
    .bail()
    .trim()
    .isLength({ min: 10 })
    .withMessage(
      "Please share a bit more so we can reflect on your day meaningfully"
    ),
];

import { body, param, query } from "express-validator";

/**
 * Create diary entry validation
 * POST /api/v1/diary
 */
export const createDiaryValidator = [
  body("text")
    .exists()
    .withMessage("Please share something about your day")
    .bail()
    .isString()
    .withMessage("Diary text must be readable text")
    .bail()
    .trim()
    .isLength({ min: 10 })
    .withMessage(
      "Please write a little more so we can reflect on your day meaningfully"
    ),
];

/**
 * Diary ID param validation
 * GET /api/v1/diary/:id
 * DELETE /api/v1/diary/:id
 */
export const diaryIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid diary entry identifier"),
];

/**
 * Diary history pagination validation
 * GET /api/v1/diary/history
 */
export const diaryHistoryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage("Limit must be between 1 and 30"),
];

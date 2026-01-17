import { body, param, query } from "express-validator";

/**
 * Create diary entry validation
 * POST /api/v1/diary
 * (analysis-based, encrypted at rest)
 */
export const createDiaryValidator = [
  body("analysis")
    .exists()
    .withMessage("Analysis data is required")
    .bail()
    .isObject()
    .withMessage("Analysis must be an object"),

  body("analysis.summary")
    .exists()
    .withMessage("Summary is required")
    .bail()
    .isString()
    .withMessage("Summary must be text"),

  body("analysis.mood")
    .exists()
    .withMessage("Mood is required")
    .bail()
    .isString()
    .withMessage("Mood must be text"),

  body("analysis.emotions")
    .exists()
    .withMessage("Emotions are required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Emotions must be a non-empty array"),

  body("analysis.productivityScore")
    .exists()
    .withMessage("Productivity score is required")
    .bail()
    .isInt({ min: 1, max: 10 })
    .withMessage("Productivity score must be between 1 and 10"),

  body("analysis.insight")
    .exists()
    .withMessage("Insight is required")
    .bail()
    .isString()
    .withMessage("Insight must be text"),
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

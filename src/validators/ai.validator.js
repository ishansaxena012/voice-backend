import { body } from "express-validator";

/**
 * Validate STT analysis request
 * POST /api/v1/ai/analyze
 */
export const analyzeSTTValidator = [
  body("text")
    .exists()
    .withMessage("STT text is required")
    .bail()
    .isString()
    .withMessage("STT text must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("STT text cannot be empty")
    .isLength({ min: 3 })
    .withMessage("STT text is too short"),
];

/**
 * POST /api/v1/ai/notes
 */
export const generateNotesValidator = [
  body("analysis")
    .exists()
    .withMessage("Analysis data is required")
    .bail()
    .isObject()
    .withMessage("Analysis must be an object"),
];

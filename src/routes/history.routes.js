import { Router } from "express";
import {
  getUserHistory,
  getHistoryById,
  deleteHistory
} from "../controllers/history.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * History Routes
 * Base path: /api/v1/history
 */

// Get all history entries for logged-in user
router.get(
  "/",
  verifyJWT,
  getUserHistory
);

// Get single history entry by ID
router.get(
  "/:id",
  verifyJWT,
  getHistoryById
);

// Delete a history entry
router.delete(
  "/:id",
  verifyJWT,
  deleteHistory
);

export default router;

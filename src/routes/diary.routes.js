import { Router } from "express";
import {
  createDiaryEntry,
  getTodayDiary,
  getDiaryHistory,
  updateDiaryEntry,
  deleteDiaryEntry,
} from "../controllers/diary.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Base path: /api/v1/diary
 */

router.post("/", verifyJWT, createDiaryEntry);
router.get("/today", verifyJWT, getTodayDiary);
router.get("/history", verifyJWT, getDiaryHistory);
router.put("/:id", verifyJWT, updateDiaryEntry);
router.delete("/:id", verifyJWT, deleteDiaryEntry);

export default router;

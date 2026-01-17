import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  analyzeDaily,
  analyzeWeekly,
  getWeeklyAnalysis, 
  getDailyAnalysis,
} from "../controllers/analysis.controller.js";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/daily", verifyJWT, analyzeDaily);
router.get("/daily", verifyJWT, getDailyAnalysis);


// Weekly generate (AI → encrypt → save)
router.post("/weekly", verifyJWT, analyzeWeekly);

// Weekly fetch (decrypt → return)
router.get("/weekly", verifyJWT, getWeeklyAnalysis);

export default router;

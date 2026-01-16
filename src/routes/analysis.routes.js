import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  analyzeDaily,
  analyzeWeekly,
} from "../controllers/analysis.controller.js";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware.js";


const router = express.Router();

router.post("/daily", verifyJWT,aiRateLimiter , analyzeDaily);
router.post("/weekly", verifyJWT,aiRateLimiter, analyzeWeekly);

export default router;

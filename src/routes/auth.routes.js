import { Router } from "express";
import {
  googleAuth,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();


router.post("/google", authRateLimiter ,googleAuth);

router.get("/me", verifyJWT, getCurrentUser);

export default router;

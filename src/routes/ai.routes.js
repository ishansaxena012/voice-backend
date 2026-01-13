import { Router } from "express";
import { analyzeSTT } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.post(
  "/analyze",
  verifyJWT,
  analyzeSTT
);

export default router;

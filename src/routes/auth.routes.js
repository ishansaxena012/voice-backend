import { Router } from "express";
import {
  googleAuth,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/google", googleAuth);

router.get("/me", verifyJWT, getCurrentUser);

export default router;

import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const router = Router();

/**
 * Health Check Routes
 * Base path: /api/v1
 */

// Liveness + basic readiness check
router.get("/health", healthCheck);

export default router;

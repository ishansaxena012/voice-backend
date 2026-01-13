import mongoose from "mongoose";
import os from "os";
import  ApiResponse  from "../utils/ApiResponse.js";

/**
 * @desc    Health check endpoint
 * @route   GET /api/v1/health
 * @access  Public
 */
const healthCheck = async (req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    server: {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      platform: os.platform(),
      cpuArch: os.arch(),
      memoryUsageMB: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    },
    database: {
      type: "MongoDB",
      state: dbStatusMap[dbState] || "unknown"
    }
  };

  return res.status(200).json(
    new ApiResponse(200, healthData, "Service is healthy")
  );
};

export { healthCheck };

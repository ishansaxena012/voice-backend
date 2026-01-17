import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Diary from "../models/diary.model.js";
import { analyzeDailyText } from "../services/analysis.service.js";
import { generateWeeklyAnalysisService } from "../services/weeklyAnalysis.service.js";
import { getWeeklyAnalysisService } from "../services/weeklyRead.service.js";
import { encrypt } from "../utils/encryption.js";
import { getTodayDiaryService } from "../services/diary.service.js";


/**
 * DAILY ANALYSIS
 * POST /api/v1/analysis/daily
 * Saves encrypted data to diaries collection
 */
export const analyzeDaily = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(400, "Text is required for analysis");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Analyze (plaintext exists only in memory)
  const analysis = await analyzeDailyText(text);

  // Encrypt analysis
  const encryptedAnalysis = encrypt(JSON.stringify(analysis));

  // Save encrypted diary entry
  const diary = await Diary.create({
    userId,
    encryptedAnalysis,
    entryDate: new Date(),
    analysisVersion: 1,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        diaryId: diary._id,
        date: diary.entryDate,
      },
      "Diary entry analyzed and saved securely"
    )
  );
});


/**
 * DAILY ANALYSIS (FETCH TODAY)
 * GET /api/v1/analysis/daily
 */
export const getDailyAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const diary = await getTodayDiaryService(userId);

  if (!diary) {
    throw new ApiError(404, "No diary entry for today");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      diary,
      "Daily analysis fetched successfully"
    )
  );
});



/**
 * WEEKLY ANALYSIS (GENERATE)
 * POST /api/v1/analysis/weekly
 */
export const analyzeWeekly = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const weeklyAnalysis =
    await generateWeeklyAnalysisService(userId);

  res.status(200).json(
    new ApiResponse(
      200,
      weeklyAnalysis,
      "Weekly analysis saved securely"
    )
  );
});

/**
 * WEEKLY ANALYSIS (FETCH)
 * GET /api/v1/analysis/weekly?weekStart=YYYY-MM-DD
 */
export const getWeeklyAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { weekStart } = req.query;
  if (!weekStart) {
    throw new ApiError(400, "weekStart query parameter is required");
  }

  const weekly = await getWeeklyAnalysisService({
    userId,
    weekStart,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      weekly,
      "Weekly analysis fetched successfully"
    )
  );
});

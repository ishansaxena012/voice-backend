import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Diary from "../models/diary.model.js";
import { analyzeDailyText } from "../services/analysis.service.js";
import { generateWeeklyAnalysisService } from "../services/weeklyAnalysis.service.js";

/**
 * DAILY ANALYSIS
 * POST /api/v1/analysis/daily
 * Saves to diaries collection
 */
export const analyzeDaily = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    throw new ApiError(400, "Text is required for daily analysis");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // AI analysis
  const analysis = await analyzeDailyText(text);

  // Save daily diary
  const diary = await Diary.create({
    userId,
    text,
    analysis,
    entryDate: new Date(),
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        diaryId: diary._id,
        date: diary.entryDate,
        analysis,
      },
      "Daily analysis saved successfully"
    )
  );
});

/**
 * WEEKLY ANALYSIS
 * POST /api/v1/analysis/weekly
 * Saves to weeklyAnalyses collection
 */
export const analyzeWeekly = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Service handles:
  // - week calculation
  // - duplicate prevention
  // - diary fetching
  // - AI generation
  // - saving to DB
  const weeklyAnalysis =
    await generateWeeklyAnalysisService(userId);

  res.status(200).json(
    new ApiResponse(
      200,
      weeklyAnalysis,
      "Weekly analysis saved successfully"
    )
  );
});

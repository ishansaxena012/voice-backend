import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Diary from "../models/diary.model.js";
import { analyzeDailyText } from "../services/analysis.service.js";

/**
 * Create Daily Diary Entry
 * POST /api/v1/diary
 */
export const createDiaryEntry = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    throw new ApiError(400, "Diary text is required");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Prevent duplicate entry per day
  const existingEntry = await Diary.findOne({
    userId: req.user._id,
    entryDate: { $gte: todayStart, $lte: todayEnd },
  });

  if (existingEntry) {
    throw new ApiError(409, "Diary entry for today already exists");
  }

  const analysis = await analyzeDailyText(text);

  const diary = await Diary.create({
    userId: req.user._id,
    text,
    analysis,
    entryDate: new Date(),
  });

  res.status(201).json(
    new ApiResponse(201, diary, "Diary entry created successfully")
  );
});

/**
 * Get Today's Diary Entry
 * GET /api/v1/diary/today
 */
export const getTodayDiary = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const diary = await Diary.findOne({
    userId: req.user._id,
    entryDate: { $gte: start, $lte: end },
  });

  if (!diary) {
    throw new ApiError(404, "No diary entry found for today");
  }

  res.status(200).json(
    new ApiResponse(200, diary, "Today's diary fetched")
  );
});

/**
 * Get Diary History (Paginated)
 * GET /api/v1/diary/history?page=1&limit=10
 */
export const getDiaryHistory = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const diaries = await Diary.find({ userId: req.user._id })
    .sort({ entryDate: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(200, diaries, "Diary history fetched")
  );
});

/**
 * Update Diary Entry (Re-analysis)
 * PUT /api/v1/diary/:id
 */
export const updateDiaryEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    throw new ApiError(400, "Updated text is required");
  }

  const diary = await Diary.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!diary) {
    throw new ApiError(404, "Diary entry not found");
  }

  const updatedAnalysis = await analyzeDailyText(text);

  diary.text = text;
  diary.analysis = updatedAnalysis;
  diary.isEdited = true;
  diary.analysisVersion += 1;

  await diary.save();

  res.status(200).json(
    new ApiResponse(200, diary, "Diary entry updated successfully")
  );
});

/**
 * Delete Diary Entry
 * DELETE /api/v1/diary/:id
 */
export const deleteDiaryEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const diary = await Diary.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!diary) {
    throw new ApiError(404, "Diary entry not found");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Diary entry deleted successfully")
  );
});

import Diary from "../models/diary.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Create diary entry
 */
export const createDiaryEntryService = async ({
  userId,
  text,
  analysis
}) => {
  return await Diary.create({
    userId,
    text,
    analysis,
    entryDate: new Date(),
    
  });
};

/**
 * Get today's diary entry for a user
 */
export const getTodayDiaryService = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await Diary.findOne({
    userId,
    entryDate: { $gte: start, $lte: end },
  });
};

/**
 * Get diary history (paginated)
 */
export const getDiaryHistoryService = async (
  userId,
  page = 1,
  limit = 10
) => {
  return await Diary.find({ userId })
    .sort({ entryDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Get diary entry by ID
 */
export const getDiaryByIdService = async (userId, diaryId) => {
  const diary = await Diary.findOne({
    _id: diaryId,
    userId,
  });

  if (!diary) {
    throw new ApiError(404, "Diary entry not found");
  }

  return diary;
};

/**
 * Delete diary entry
 */
export const deleteDiaryService = async (userId, diaryId) => {
  const deleted = await Diary.findOneAndDelete({
    _id: diaryId,
    userId,
  });

  if (!deleted) {
    throw new ApiError(404, "Diary entry not found");
  }

  return deleted;
};

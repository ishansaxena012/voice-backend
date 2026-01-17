import Diary from "../models/diary.model.js";
import ApiError from "../utils/ApiError.js";
import { encrypt, decrypt } from "../utils/encryption.js";

/**
 * Create diary entry (ENCRYPTED)
 */
export const createDiaryEntryService = async ({
  userId,
  analysis,
}) => {
  if (!userId || !analysis) {
    throw new ApiError(400, "Missing required fields");
  }

  const encryptedAnalysis = encrypt(
    JSON.stringify(analysis)
  );

  return await Diary.create({
    userId,
    encryptedAnalysis,
    entryDate: new Date(),
    analysisVersion: 1,
  });
};

/**
 * Get today's diary entry for a user (DECRYPTED)
 */
export const getTodayDiaryService = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const diary = await Diary.findOne({
    userId,
    entryDate: { $gte: start, $lte: end },
  });

  if (!diary) return null;

  return {
    _id: diary._id,
    entryDate: diary.entryDate,
    analysis: JSON.parse(
      decrypt(diary.encryptedAnalysis)
    ),
  };
};

/**
 * Get diary history (paginated, DECRYPTED)
 */
export const getDiaryHistoryService = async (
  userId,
  page = 1,
  limit = 10
) => {
  const diaries = await Diary.find({ userId })
    .sort({ entryDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return diaries.map((d) => ({
    _id: d._id,
    entryDate: d.entryDate,
    analysis: JSON.parse(
      decrypt(d.encryptedAnalysis)
    ),
  }));
};

/**
 * Get diary entry by ID (DECRYPTED)
 */
export const getDiaryByIdService = async (userId, diaryId) => {
  const diary = await Diary.findOne({
    _id: diaryId,
    userId,
  });

  if (!diary) {
    throw new ApiError(404, "Diary entry not found");
  }

  return {
    _id: diary._id,
    entryDate: diary.entryDate,
    analysis: JSON.parse(
      decrypt(diary.encryptedAnalysis)
    ),
  };
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

  return true;
};

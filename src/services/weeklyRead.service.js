import WeeklyAnalysis from "../models/weeklyAnalysis.model.js";
import ApiError from "../utils/ApiError.js";
import { decrypt } from "../utils/encryption.js";

/**
 * Get weekly analysis for a user (DECRYPTED)
 */
export const getWeeklyAnalysisService = async ({
  userId,
  weekStart,
}) => {
  if (!userId || !weekStart) {
    throw new ApiError(400, "User ID and weekStart are required");
  }

  const weekly = await WeeklyAnalysis.findOne({
    userId,
    weekStart: new Date(weekStart),
  });

  if (!weekly) {
    throw new ApiError(404, "Weekly analysis not found");
  }

  const decryptedAnalysis = JSON.parse(
    decrypt(weekly.encryptedWeeklyAnalysis)
  );

  return {
    weeklyAnalysisId: weekly._id,
    weekStart: weekly.weekStart,
    weekEnd: weekly.weekEnd,
    entryCount: weekly.entryCount,
    analysis: decryptedAnalysis,
  };
};

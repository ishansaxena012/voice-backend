import ApiError from "../utils/ApiError.js";
import Diary from "../models/diary.model.js";
import WeeklyAnalysis from "../models/weeklyAnalysis.model.js";
import { generateWithGemini } from "../config/gemini.config.js";
import { decrypt, encrypt } from "../utils/encryption.js";

/**
 * Generate weekly analysis for a user
 * Safe to be used by controllers, cron jobs, or workers
 */
export const generateWeeklyAnalysisService = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  /* Calculate week range (Sunday → Saturday) */
  const today = new Date();
  const dayOfWeek = today.getDay();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  /* Prevent duplicate generation */
  const existing = await WeeklyAnalysis.findOne({
    userId,
    weekStart,
  });

  if (existing) {
    return {
      weeklyAnalysisId: existing._id,
      weekStart: existing.weekStart,
      weekEnd: existing.weekEnd,
      entryCount: existing.entryCount,
    };
  }

  /* Fetch encrypted diary entries */
  const diaries = await Diary.find({
    userId,
    entryDate: { $gte: weekStart, $lte: weekEnd },
  })
    .sort({ entryDate: 1 })
    .select("encryptedAnalysis entryDate");

  if (diaries.length < 3) {
    throw new ApiError(
      400,
      "Not enough diary entries for a meaningful weekly reflection"
    );
  }

  /* 🔓 Decrypt diary analyses in memory */
  const decryptedAnalyses = diaries.map((d) =>
    JSON.parse(decrypt(d.encryptedAnalysis))
  );

  /* Aggregate data */
  const moods = decryptedAnalyses.map((a) => a.mood);
  const emotions = decryptedAnalyses.flatMap((a) => a.emotions);

  const avgProductivity =
    decryptedAnalyses.reduce(
      (sum, a) => sum + a.productivityScore,
      0
    ) / decryptedAnalyses.length;

  /* AI prompt */
  const prompt = `
You are reflecting on someone’s week as a thoughtful, kind, emotionally intelligent human being.

Weekly context:
- Moods experienced: ${moods.join(", ")}
- Emotions felt: ${emotions.join(", ")}
- Average productivity level (1–10, context only): ${avgProductivity.toFixed(1)}
- Number of diary entries: ${decryptedAnalyses.length}

Respond ONLY in valid JSON with this structure:
{
  "summary": "...",
  "moodTrend": "...",
  "emotionalPattern": "...",
  "productivityTrend": "...",
  "positiveHabit": "...",
  "improvementFocus": "...",
  "message": "..."
}
`;

  /* Call Gemini */
  const aiResponse = await generateWithGemini(prompt);

  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new ApiError(500, "Weekly AI response did not contain valid JSON");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new ApiError(500, "Failed to parse weekly AI response");
  }

  /* Validate AI output */
  const requiredFields = [
    "summary",
    "moodTrend",
    "emotionalPattern",
    "productivityTrend",
    "positiveHabit",
    "improvementFocus",
    "message",
  ];

  for (const field of requiredFields) {
    if (!parsed[field] || typeof parsed[field] !== "string") {
      throw new ApiError(
        500,
        `Weekly AI response missing or invalid field: ${field}`
      );
    }
  }

  /* Encrypt weekly analysis BEFORE saving */
  const encryptedWeeklyAnalysis = encrypt(
    JSON.stringify(parsed)
  );

  /* Save encrypted weekly analysis */
  const weeklyDoc = await WeeklyAnalysis.create({
    userId,
    weekStart,
    weekEnd,
    entryCount: diaries.length,
    encryptedWeeklyAnalysis,
    analysisVersion: 1,
  });

  return {
    weeklyAnalysisId: weeklyDoc._id,
    weekStart: weeklyDoc.weekStart,
    weekEnd: weeklyDoc.weekEnd,
    entryCount: weeklyDoc.entryCount,
  };
};

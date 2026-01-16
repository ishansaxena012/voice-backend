import ApiError from "../utils/ApiError.js";
import Diary from "../models/diary.model.js";
import WeeklyAnalysis from "../models/weeklyAnalysis.model.js";
import { generateWithGemini } from "../config/gemini.config.js";

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

// getDay(): Sunday = 0, Monday = 1, ..., Saturday = 6
const dayOfWeek = today.getDay();

const weekStart = new Date(today);
weekStart.setDate(today.getDate() - dayOfWeek);
weekStart.setHours(0, 0, 0, 0);

const weekEnd = new Date(weekStart);
weekEnd.setDate(weekStart.getDate() + 6);
weekEnd.setHours(23, 59, 59, 999);


  /*  Prevent duplicate generation  */
  const existing = await WeeklyAnalysis.findOne({
    userId,
    weekStart,
  });

  if (existing) {
    return existing;
  }

  /*  Fetch diary entries  */
  const diaries = await Diary.find({
    userId,
    entryDate: { $gte: weekStart, $lte: weekEnd },
  })
    .sort({ entryDate: 1 })
    .select("analysis entryDate");

  if (diaries.length < 3) {
    throw new ApiError(
      400,
      "Not enough diary entries for a meaningful weekly reflection"
    );
  }

  /*  Aggregate data  */
  const moods = diaries.map((d) => d.analysis.mood);
  const emotions = diaries.flatMap((d) => d.analysis.emotions);

  const avgProductivity =
    diaries.reduce(
      (sum, d) => sum + d.analysis.productivityScore,
      0
    ) / diaries.length;

  /*  Humanized AI prompt  */
  const prompt = `
You are reflecting on someone’s week as a thoughtful, kind, emotionally intelligent human being.

You are NOT an AI, not a therapist, not a coach, and not a productivity judge.
You are a calm, supportive presence — like a close friend who listens carefully
and reflects back patterns with warmth and understanding.

Your goal is to help the person feel:
- seen
- understood
- gently encouraged
- never judged or pressured

Important rules:
- Do NOT sound technical, robotic, or analytical
- Do NOT use harsh language, blame, or criticism
- Do NOT shame low productivity or difficult emotions
- Do NOT exaggerate positives or negatives
- Avoid clichés and generic motivational talk
- Speak with emotional nuance and balance

Weekly context:
- Moods experienced: ${moods.join(", ")}
- Emotions felt: ${emotions.join(", ")}
- Average productivity level (1–10, context only): ${avgProductivity.toFixed(1)}
- Number of diary entries: ${diaries.length}

Reflect on the week as a human would — carefully, thoughtfully, and honestly.

Respond ONLY in valid JSON.
Do NOT include markdown, explanations, or extra text.

JSON format:
{
  "summary": "A warm, human summary of how the week felt overall",
  "moodTrend": "A gentle description of how the mood shifted or stayed steady",
  "emotionalPattern": "Subtle emotional patterns noticed across the week",
  "productivityTrend": "A kind, realistic reflection on productivity without pressure",
  "positiveHabit": "One genuine strength or small positive habit shown",
  "improvementFocus": "One soft, non-judgmental area to be mindful of next week",
  "message": "A short, heartfelt message that feels written by a caring human"
}
`;

  /*  Call Gemini  */
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

  /*  Validate AI output  */
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
    if (
      !parsed[field] ||
      typeof parsed[field] !== "string"
    ) {
      throw new ApiError(
        500,
        `Weekly AI response missing or invalid field: ${field}`
      );
    }
  }

  /*  Save weekly analysis  */
  const weeklyAnalysis = await WeeklyAnalysis.create({
    userId,
    weekStart,
    weekEnd,
    entryCount: diaries.length,
    ...parsed,
  });

  return weeklyAnalysis;
};

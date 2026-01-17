import ApiError from "../utils/ApiError.js";
import buildPrompt from "../utils/promptBuilder.js";
import { generateWithGemini } from "../config/gemini.config.js";

// Safer JSON extraction (first JSON object only)
const extractJSON = (response) => {
  const match = response.match(/\{[\s\S]*?\}/);
  return match ? match[0] : null;
};

export const analyzeDailyText = async (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new ApiError(400, "Valid diary text is required");
  }

  const prompt = buildPrompt(text);
  const aiResponse = await generateWithGemini(prompt);

  const jsonString = extractJSON(aiResponse);
  if (!jsonString) {
    throw new ApiError(500, "AI response does not contain valid JSON");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new ApiError(500, "Failed to parse AI JSON response");
  }

  //  NORMALIZATION (THIS IS THE KEY FIX)
  const normalized = {
    summary: parsed.summary?.toString().trim() || "No summary available",
    mood: parsed.mood?.toString().trim() || "neutral",
    emotions: Array.isArray(parsed.emotions)
      ? parsed.emotions.map((e) => e.toString())
      : parsed.emotions
      ? [parsed.emotions.toString()]
      : ["neutral"],
    productivityScore: Math.min(
      10,
      Math.max(1, Number(parsed.productivityScore) || 5)
    ),
    insight: parsed.insight?.toString().trim() || "No insight available",
  };

  //  FINAL VALIDATION (ON NORMALIZED DATA)
  if (
    !normalized.summary ||
    !normalized.mood ||
    !Array.isArray(normalized.emotions) ||
    typeof normalized.productivityScore !== "number" ||
    !normalized.insight
  ) {
    throw new ApiError(500, "AI response schema invalid");
  }

  return normalized;
};

import ApiError from "../utils/ApiError.js";
import buildPrompt from "../utils/promptBuilder.js";
import { generateWithGemini } from "../config/gemini.config.js";

// Helper stays in service
const extractJSON = (response) => {
  const match = response.match(/\{[\s\S]*\}/);
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

  try {
    const parsed = JSON.parse(jsonString);

    if (
      !parsed.summary ||
      !parsed.mood ||
      !Array.isArray(parsed.emotions) ||
      typeof parsed.productivityScore !== "number" ||
      !parsed.insight
    ) {
      throw new ApiError(500, "AI response schema invalid");
    }

    return parsed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to parse AI response");
  }
};

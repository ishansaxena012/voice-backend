// Receive STT text from frontend
// Validate input
// Build an intelligent prompt
// Call Gemini
// Parse AI output
// (Optionally) save result to DB
// Send structured response back

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import buildPrompt from "../utils/promptBuilder.js";
import { generateWithGemini } from "../config/gemini.config.js";
import  ApiResponse  from "../utils/ApiResponse.js";

const extractJSON = (response) => {
  const match = response.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

export const analyzeSTT = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    throw new ApiError(400, "Valid STT text is required");
  }

  const prompt = buildPrompt(text);
  const aiResponse = await generateWithGemini(prompt);

  const jsonString = extractJSON(aiResponse);
  if (!jsonString) {
    throw new ApiError(500, "AI response does not contain valid JSON");
  }

  let parsedOutput;
  try {
    parsedOutput = JSON.parse(jsonString);
  } catch {
    throw new ApiError(500, "Failed to parse AI response");
  }

  return res.status(200).json(
    new ApiResponse(200, parsedOutput, "STT analysis successful")
  );
});

import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // stable
});

export const generateWithGemini = async (prompt) => {
  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt must be a non-empty string");
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result?.response?.text?.();

    if (!response) {
      throw new ApiError(500, "Empty response from Gemini");
    }

    return response;
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Gemini generation failed"
    );
  }
};

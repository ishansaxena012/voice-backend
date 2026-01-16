import ApiError from "../utils/ApiError.js";
import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


export const generateWithGemini = async (prompt) => {
  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required for Gemini");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent(prompt);

    const responseText =
      result?.response?.text?.();

    if (!responseText) {
      throw new ApiError(500, "Empty response from Gemini");
    }

    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);

    throw new ApiError(
      500,
      "Failed to generate response from AI service"
    );
  }
};

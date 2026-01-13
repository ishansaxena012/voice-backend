import e from "express";
import ApiError from "./ApiError.js";

/**
 * Builds an intelligent prompt for Gemini
 * based on STT text input
 */
const buildPrompt = (sttText) => {
  if (!sttText || typeof sttText !== "string") {
    throw new ApiError(400, "Invalid STT text input");
  }

  return `
You are an intelligent task analysis assistant.

Analyze the following transcribed speech and return a structured JSON response.

Your goals:
1. Identify if the text contains an actionable task
2. Determine task priority (low | medium | high | critical)
3. Detect urgency (immediate | today | upcoming | someday)
4. Classify task type (reminder | meeting | deadline | idea | note | query)
5. Extract key action items
6. Provide a concise AI-generated summary
7. If no task exists, mark actionable=false

Rules:
- Be concise
- Do NOT add explanations
- Output ONLY valid JSON
- Use null if a field is not applicable

Speech Text:
"""
${sttText}
"""

Expected JSON format:
{
  "actionable": boolean,
  "taskType": string | null,
  "priority": "low" | "medium" | "high" | "critical" | null,
  "urgency": "immediate" | "today" | "upcoming" | "someday" | null,
  "actionItems": string[],
  "summary": string
}
`;
};
export default buildPrompt;
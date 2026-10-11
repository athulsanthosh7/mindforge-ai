import { GoogleGenAI } from "@google/genai";

const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "Gemini API is not configured.",
    });
  }

  try {
    const { question, topic, attempt, mode } = req.body || {};

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    if (question.length > 5000) {
      return res.status(400).json({
        error: "Your question is too long. Please shorten it.",
      });
    }

    const safeTopic =
      typeof topic === "string"
        ? topic.slice(0, 150)
        : "General";

    const safeAttempt =
      typeof attempt === "string"
        ? attempt.slice(0, 3000)
        : "No attempt provided.";

    const validModes = ["guide", "hint", "explain"];

    const selectedMode = validModes.includes(mode)
      ? mode
      : "guide";

    const modeInstructions = {
      guide: `
Guide the student using questions and small reasoning steps.
Do not immediately give the complete answer.
Help the student discover the solution independently.
End with a question that encourages thinking.
`,
      hint: `
Give one small, useful hint.
Do not reveal the complete solution.
Point toward the next logical step.
Keep the hint concise.
`,
      explain: `
Explain the concept clearly and step by step.
Use simple language appropriate for a college student.
Include a relevant example and explain why each step works.
Finish with a short question to check understanding.
`,
    };

    const prompt = `
You are MindForge AI, a supportive learning assistant.

Your purpose is to develop independent thinking,
reasoning, problem-solving skills, and understanding.

SUBJECT:
${safeTopic}

STUDENT QUESTION:
${question.trim()}

STUDENT'S CURRENT UNDERSTANDING:
${safeAttempt}

SUPPORT MODE:
${selectedMode}

TEACHING INSTRUCTIONS:
${modeInstructions[selectedMode]}

RULES:
1. Be accurate, clear, patient, and encouraging.
2. Adapt to the student's current understanding.
3. Never shame the student for an incorrect answer.
4. Prefer reasoning over memorization.
5. Use readable Markdown.
6. Explain misconceptions constructively.
7. Do not claim mastery without evidence.
8. Keep the response focused.
9. In hint mode, never reveal the complete solution.
10. Encourage the student to explain their reasoning.

Respond according to the selected support mode.
`;

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const reply = result.text;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({
        error: "The AI returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({
      reply,
      model: MODEL,
      mode: selectedMode,
    });
  } catch (error) {
    console.error("Gemini request failed:", error.message || error);

    const message = String(error.message || "").toLowerCase();

    if (
      error.status === 429 ||
      message.includes("quota") ||
      message.includes("rate limit")
    ) {
      return res.status(429).json({
        error: "Gemini's request limit or quota has been reached.",
      });
    }

    if (
      error.status === 401 ||
      error.status === 403 ||
      message.includes("permission denied") ||
      message.includes("api key")
    ) {
      return res.status(401).json({
        error: "Gemini authentication failed. Check your API key and permissions.",
      });
    }

    if (
      error.status === 404 ||
      message.includes("model not found") ||
      message.includes("not found")
    ) {
      return res.status(503).json({
        error: "The configured Gemini model is unavailable. Check GEMINI_MODEL.",
      });
    }

    return res.status(500).json({
      error: "The AI tutor could not respond. Please try again.",
    });
  }
}
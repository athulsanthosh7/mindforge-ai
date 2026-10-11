import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "20kb" }));

// Initialize Gemini
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

// Model configuration
const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "";

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiConfigured: Boolean(ai),
    primaryModel: PRIMARY_MODEL,
    fallbackConfigured: Boolean(FALLBACK_MODEL),
  });
});

// Extract HTTP status from SDK errors
function getErrorStatus(error) {
  if (error.status || error.code) {
    const status = Number(error.status || error.code);

    if (Number.isFinite(status)) {
      return status;
    }
  }

  // Some SDK errors include the API response inside the message.
  try {
    const parsed = JSON.parse(error.message);

    return Number(
      parsed.error?.code || parsed.error?.statusCode
    ) || null;
  } catch {
    return null;
  }
}

// Generate a response with retries and optional model fallback
async function generateTutorResponse(prompt) {
  const models = [
    ...new Set(
      [PRIMARY_MODEL, FALLBACK_MODEL].filter(Boolean)
    ),
  ];

  let lastError;

  for (const model of models) {
    // Two attempts per model
    for (let retry = 1; retry <= 2; retry++) {
      try {
        console.log(
          `Requesting Gemini model: ${model} (attempt ${retry}/2)`
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        if (!response.text) {
          throw new Error("Gemini returned an empty response.");
        }

        console.log(`Gemini response received from ${model}`);

        return response.text;
      } catch (error) {
        lastError = error;

        const status = getErrorStatus(error);

        console.error("Gemini request failed:", {
          model,
          retry,
          status,
          message: error.message,
        });

        // Retry temporary server errors and rate limits.
        const retryable = [
          408,
          429,
          500,
          502,
          503,
          504,
        ].includes(status);

        // Do not repeat invalid requests or permission errors.
        if (!retryable) {
          break;
        }

        // Wait before retrying.
        if (retry < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1500)
          );
        }
      }
    }

    console.log(`Model ${model} did not succeed.`);

    // Continue to the fallback model, if configured.
  }

  throw lastError || new Error("All Gemini models failed.");
}

// AI Tutor endpoint
app.post("/api/tutor", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const {
      question,
      attempt: learnerAttempt = "",
      topic = "General",
      mode = "guide",
    } = req.body || {};

    // Validate question
    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 3000
    ) {
      return res.status(400).json({
        error:
          "Enter a valid question of up to 3000 characters.",
      });
    }

    // Validate learner attempt
    if (
      typeof learnerAttempt !== "string" ||
      learnerAttempt.length > 2000
    ) {
      return res.status(400).json({
        error:
          "Your attempt must be text under 2000 characters.",
      });
    }

    const validModes = ["guide", "hint", "explain"];

    const selectedMode = validModes.includes(mode)
      ? mode
      : "guide";

    const safeTopic =
      typeof topic === "string"
        ? topic.slice(0, 200)
        : "General";

    // Different tutoring instructions
    const instructions = {
      guide: `
Use the Socratic teaching method.
Help the learner reason independently.
Ask one useful guiding question at a time.
Do not immediately reveal the complete answer.
Acknowledge useful reasoning in the learner's attempt.
`,

      hint: `
Give one small, useful hint.
Do not reveal the complete answer or solution.
Help the learner determine the next step independently.
`,

      explain: `
Explain the concept clearly and step by step.
Show the reasoning behind the answer.
Use a simple example when appropriate.
Finish with a short question that checks understanding.
`,
    };

    const prompt = `
You are MindForge AI, an educational tutor designed
to strengthen independent thinking.

SUBJECT:
${safeTopic}

LEARNER'S QUESTION:
${question.trim()}

LEARNER'S CURRENT THINKING:
${learnerAttempt.trim() || "No attempt provided yet."}

TUTORING MODE:
${instructions[selectedMode]}

IMPORTANT RULES:
- Be friendly, accurate, and concise.
- Encourage independent reasoning.
- Never shame the learner for mistakes.
- Do not claim the learner has mastered a concept
  without evidence.
- In hint mode, do not provide the complete solution.
- In guide mode, prioritize a guiding question.
- In explain mode, explain the reasoning clearly.
- If information is uncertain, acknowledge the uncertainty.
`;

    const reply = await generateTutorResponse(prompt);

    return res.json({
      reply,
      mode: selectedMode,
      topic: safeTopic,
    });
  } catch (error) {
    const status = getErrorStatus(error);

    console.error("AI Tutor failed:", {
      status,
      message: error.message,
    });

    if (status === 429) {
      return res.status(429).json({
        error:
          "The AI service has reached a usage limit. Please wait before trying again.",
      });
    }

    if ([500, 502, 503, 504].includes(status)) {
      return res.status(503).json({
        error:
          "The AI model is temporarily unavailable. Please try again shortly.",
      });
    }

    if (status === 401 || status === 403) {
      return res.status(502).json({
        error:
          "The AI service rejected the request. Check your API key and model access.",
      });
    }

    if (status === 404) {
      return res.status(502).json({
        error:
          "The configured Gemini model is unavailable. Check GEMINI_MODEL in your .env file.",
      });
    }

    return res.status(502).json({
      error:
        "The AI tutor could not respond. Please try again.",
    });
  }
});

// Start the backend
app.listen(PORT, () => {
  console.log(
    `MindForge AI backend running on port ${PORT}`
  );

  console.log(`Primary Gemini model: ${PRIMARY_MODEL}`);

  if (FALLBACK_MODEL) {
    console.log(`Fallback Gemini model: ${FALLBACK_MODEL}`);
  }
});
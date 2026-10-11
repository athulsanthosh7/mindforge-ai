import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./AITutor.css";

const MODES = [
  {
    id: "guide",
    icon: "🧠",
    label: "Guide Me",
    description: "Help me reason through the problem",
  },
  {
    id: "hint",
    icon: "💡",
    label: "Give Me a Hint",
    description: "Give me a small clue",
  },
  {
    id: "explain",
    icon: "📖",
    label: "Explain This",
    description: "Explain the reasoning step by step",
  },
];

const TOPICS = [
  "General",
  "Programming",
  "Mathematics",
  "Science",
  "Critical Thinking",
];

const HISTORY_KEY = "mindforge-ai-tutor-history";

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AITutor() {
  const [question, setQuestion] = useState("");
  const [attempt, setAttempt] = useState("");
  const [topic, setTopic] = useState("Programming");
  const [mode, setMode] = useState("guide");

  const [history, setHistory] = useState(loadHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [lastMode, setLastMode] = useState("guide");

  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
      );
    } catch (storageError) {
      console.warn(
        "Could not save tutor history:",
        storageError.message
      );
    }
  }, [history]);

  async function askTutor(selectedMode = mode) {
    if (!question.trim()) {
      setError("Enter a question before asking your AI tutor.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setReply("");
    setLastMode(selectedMode);

    try {
      const controller = new AbortController();

      const timeout = setTimeout(
        () => controller.abort(),
        60000
      );

      let response;

      try {
        response = await fetch("/api/tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
            attempt: attempt.trim(),
            topic,
            mode: selectedMode,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            `The AI tutor returned an error (${response.status}).`
        );
      }

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim()
      ) {
        throw new Error(
          "The AI tutor returned an empty response."
        );
      }

      setReply(data.reply);

      const entry = {
        id: `${Date.now()}-${Math.random()}`,
        question: question.trim(),
        topic,
        attempt: attempt.trim(),
        mode: selectedMode,
        reply: data.reply,
        timestamp: new Date().toISOString(),
      };

      setHistory((previous) =>
        [entry, ...previous].slice(0, 50)
      );
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "The request took too long. Please try again."
        );
      } else if (err instanceof TypeError) {
        setError(
          "Cannot connect to the tutor backend. Make sure your backend is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to connect to the AI tutor."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function openHistory(item) {
    setQuestion(item.question || "");
    setAttempt(item.attempt || "");
    setTopic(item.topic || "General");
    setMode(item.mode || "guide");
    setLastMode(item.mode || "guide");
    setReply(item.reply || "");
    setError("");
  }

  function clearHistory() {
    if (
      window.confirm(
        "Delete your saved AI tutor conversation history?"
      )
    ) {
      setHistory([]);
      setReply("");
      setError("");

      try {
        localStorage.removeItem(HISTORY_KEY);
      } catch {
        // History is already cleared in component state.
      }
    }
  }

  function startNewQuestion() {
    setQuestion("");
    setAttempt("");
    setReply("");
    setError("");
    setMode("guide");
    setLastMode("guide");
  }

  const activeMode = MODES.find(
    (item) => item.id === lastMode
  );

  return (
    <section className="ai-tutor-page">
      <div className="ai-tutor-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            YOUR PERSONAL LEARNING COMPANION
          </div>

          <h1>
            Think deeper.
            <br />
            <span>Learn with AI.</span>
          </h1>

          <p className="ai-tutor-lead">
            Get guidance when you need it, but keep your own
            reasoning at the centre of every learning session.
          </p>
        </div>

        <div className="ai-tutor-status">
          <span />
          Gemini tutor
        </div>
      </div>

      <div className="ai-tutor-grid">
        <div className="ai-tutor-main">
          <div className="ai-tutor-card">
            <div className="ai-tutor-card-heading">
              <div className="ai-tutor-icon">✳</div>

              <div>
                <h2>What are you working on?</h2>

                <p>
                  Start with a question or describe your difficulty.
                </p>
              </div>
            </div>

            <label htmlFor="tutor-question">
              YOUR QUESTION
            </label>

            <textarea
              id="tutor-question"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Example: Why does integer division in Java return 2 instead of 2.5?"
              maxLength={3000}
              rows={4}
            />

            <div className="ai-tutor-input-meta">
              <span>
                Be specific about what you want to understand.
              </span>

              <span>{question.length}/3000</span>
            </div>

            <label htmlFor="tutor-attempt">
              YOUR THINKING SO FAR
            </label>

            <textarea
              id="tutor-attempt"
              value={attempt}
              onChange={(event) =>
                setAttempt(event.target.value)
              }
              placeholder="What have you tried? What part is confusing?"
              maxLength={2000}
              rows={3}
            />

            <div className="ai-tutor-field">
              <label htmlFor="tutor-topic">
                SUBJECT
              </label>

              <select
                id="tutor-topic"
                value={topic}
                onChange={(event) =>
                  setTopic(event.target.value)
                }
              >
                {TOPICS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="ai-tutor-mode-heading">
              <h3>How should I help?</h3>

              <p>Choose the kind of support you need.</p>
            </div>

            <div className="ai-tutor-modes">
              {MODES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`ai-tutor-mode ${
                    mode === item.id ? "selected" : ""
                  }`}
                  onClick={() => setMode(item.id)}
                  aria-pressed={mode === item.id}
                  disabled={loading}
                >
                  <span className="ai-tutor-mode-icon">
                    {item.icon}
                  </span>

                  <strong>{item.label}</strong>

                  <small>{item.description}</small>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="primary-button ai-tutor-submit"
              disabled={loading || !question.trim()}
              onClick={() => askTutor()}
            >
              {loading ? "Thinking..." : "Ask MindForge AI"}

              <span>{loading ? "◌" : "→"}</span>
            </button>

            <p className="ai-tutor-privacy">
              Your question is sent to Gemini for a response.
              Conversation history is saved in this browser.
            </p>
          </div>

          {(reply || loading || error) && (
            <div className="ai-tutor-response">
              <div className="ai-tutor-response-heading">
                <div className="ai-tutor-icon">✳</div>

                <div>
                  <span>MINDFORGE AI</span>

                  <h2>
                    {loading
                      ? "Thinking it through..."
                      : error
                        ? "Let's reconnect"
                        : activeMode?.label ||
                          "Your learning guide"}
                  </h2>
                </div>
              </div>

              {loading && (
                <div
                  className="ai-tutor-loading"
                  role="status"
                  aria-live="polite"
                >
                  <span />
                  <span />
                  <span />

                  <p>Preparing your response...</p>
                </div>
              )}

              {error && (
                <div
                  className="ai-tutor-error"
                  role="alert"
                >
                  <p>{error}</p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => askTutor(lastMode)}
                    disabled={loading}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && reply && (
                <>
                  <div className="ai-tutor-reply">
                    <ReactMarkdown>
                      {reply}
                    </ReactMarkdown>
                  </div>

                  <div className="ai-tutor-reflection">
                    <strong>Now make it your own.</strong>

                    <p>
                      Can you explain the reasoning in your own
                      words or solve a similar problem without
                      assistance?
                    </p>
                  </div>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={startNewQuestion}
                  >
                    Try another question
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="ai-tutor-sidebar">
          <div className="ai-tutor-card ai-tutor-principles">
            <div className="panel-kicker">
              OUR LEARNING PHILOSOPHY
            </div>

            <h2>Guidance, not dependency.</h2>

            <div className="ai-tutor-principle">
              <span>01</span>

              <div>
                <strong>Think first</strong>

                <p>
                  Describe your own approach before asking for help.
                </p>
              </div>
            </div>

            <div className="ai-tutor-principle">
              <span>02</span>

              <div>
                <strong>Use guidance</strong>

                <p>
                  Explore a hint or guiding question before a
                  full explanation.
                </p>
              </div>
            </div>

            <div className="ai-tutor-principle">
              <span>03</span>

              <div>
                <strong>Apply independently</strong>

                <p>
                  Test your understanding on a new problem.
                </p>
              </div>
            </div>
          </div>

          <div className="ai-tutor-card ai-tutor-history">
            <div className="ai-tutor-history-heading">
              <div>
                <div className="panel-kicker">
                  ON THIS DEVICE
                </div>

                <h2>Recent conversations</h2>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  className="ai-tutor-clear"
                  onClick={clearHistory}
                >
                  Clear
                </button>
              )}
            </div>

            {!history.length ? (
              <p className="ai-tutor-empty">
                Your saved conversations will appear here.
              </p>
            ) : (
              history.slice(0, 6).map((item) => (
                <button
                  type="button"
                  className="ai-tutor-history-item"
                  key={item.id}
                  onClick={() => openHistory(item)}
                >
                  <strong>{item.question}</strong>

                  <span>
                    {item.topic} ·{" "}
                    {
                      MODES.find(
                        (entry) => entry.id === item.mode
                      )?.label
                    }
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
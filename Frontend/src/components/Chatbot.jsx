import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { askClaude } from "../services/claudeApi";

const SYSTEM_CONTEXT = `You are the JobXPortal AI Assistant, embedded in a real job platform called JobXPortal.

JobXPortal lets users:
- Search live jobs aggregated from LinkedIn, Naukri, Glassdoor, Indeed, and jobs posted directly by employers on the platform
- Build a resume (Resume Builder)
- Score their resume against a job description (Resume Match)
- Prepare for interviews (Interview Prep)
- Generate cover letters (Cover Letter Generator)
- Track job applications (Job Tracker)
- View salary insights
- Post jobs and manage listings, if they're an employer (Post a Job / Employer Dashboard)

Rules:
- Keep answers concise and conversational (3-6 sentences, unless they explicitly ask for something long like a full cover letter).
- Give specific, actionable career advice when asked (fresher advice, skills to learn, resume tips, interview prep for a named role/tech).
- If the user is asking to find or search for jobs, briefly acknowledge it and tell them to use the "Search Jobs" button that will appear below your reply — do NOT invent or list fake job openings, since you have no live data.
- If asked something unrelated to jobs/careers, answer briefly and redirect back to how JobXPortal can help.`;

const QUICK_PROMPTS = [
  "Find React jobs",
  "I'm a fresher, what should I apply for?",
  "How can I improve my resume?",
  "What skills should I learn for frontend?",
];

function looksLikeJobSearch(text) {
  return /\b(find|search|looking for|show me|any)\b.*\bjobs?\b/i.test(text) || /\bjobs?\s+(in|near)\b/i.test(text);
}

function extractJobIntent(text) {
  const lower = text.toLowerCase();
  const locMatch = lower.match(/\b(?:in|near)\s+([a-z\s]+?)(?:[.?!]|$)/);
  const location = locMatch ? locMatch[1].trim() : "";

  let keyword = text
    .replace(/\b(find|search for|looking for|show me|any|jobs?|in\s+[a-z\s]+|near\s+[a-z\s]+|please|for me)\b/gi, "")
    .trim();
  if (!keyword) keyword = "jobs";

  return { keyword, location };
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the JobXPortal Assistant. I can help you find jobs, improve your resume, prep for interviews, or figure out what to apply for next. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const jobIntent = looksLikeJobSearch(userText) ? extractJobIntent(userText) : null;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const historyText = newMessages.slice(-6).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
      const prompt = `${SYSTEM_CONTEXT}\n\nConversation so far:\n${historyText}\n\nRespond as the Assistant to the last User message.`;
      const reply = await askClaude(prompt, 500);

      setMessages((prev) => [...prev, { role: "assistant", content: reply.trim(), jobIntent }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I hit an error just now — mind trying that again?" }]);
    } finally {
      setLoading(false);
    }
  }

  function goToJobSearch(intent) {
    const where = intent.location || "india";
    navigate(`/jobs?q=${encodeURIComponent(intent.keyword)}&where=${encodeURIComponent(where)}`);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--accent)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
        aria-label="Open JobXPortal Assistant"
      >
        {open ? <X size={24} color="#09090B" /> : <MessageCircle size={24} color="#09090B" />}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 24, zIndex: 200,
          width: "min(380px, calc(100vw - 32px))", height: "min(560px, calc(100vh - 140px))",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={15} color="#09090B" />
            </div>
            <div>
              <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>JobXPortal Assistant</p>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--muted)" }}>AI-powered career help</p>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px", borderRadius: 14,
                  background: m.role === "user" ? "var(--accent)" : "var(--bg)",
                  color: m.role === "user" ? "#09090B" : "var(--text)",
                  border: m.role === "user" ? "none" : "1px solid var(--border)",
                  fontFamily: "Poppins", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
                }}>
                  {m.content}
                </div>
                {m.jobIntent && (
                  <button
                    onClick={() => goToJobSearch(m.jobIntent)}
                    style={{
                      marginTop: 6, padding: "7px 14px", borderRadius: 999,
                      background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.3)",
                      color: "var(--accent)", fontFamily: "Poppins", fontSize: 12, fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🔍 Search "{m.jobIntent.keyword}" {m.jobIntent.location ? `in ${m.jobIntent.location}` : ""}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontFamily: "Poppins", fontSize: 12 }}>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Thinking...
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: "6px 12px", borderRadius: 999,
                    background: "var(--bg)", border: "1px solid var(--border)",
                    color: "var(--muted)", fontFamily: "Poppins", fontSize: 11.5, cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs, resumes, interviews..."
              style={{
                flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "var(--accent)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              <Send size={16} color="#09090B" />
            </button>
          </form>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
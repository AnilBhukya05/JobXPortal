const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function askClaude(prompt, maxTokens = 1000) {
  if (!GROQ_KEY) {
    throw new Error("Missing VITE_GROQ_API_KEY in your .env file. Get a free key at console.groq.com");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GROQ_KEY,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: maxTokens,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Follow the user's instructions exactly. If they ask for JSON, return only raw JSON starting with { or [. If they ask for plain text, return only plain text. Never add explanations, markdown, or code blocks.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "API request failed — status " + res.status);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export function parseJSON(text) {
  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const objStart = cleaned.indexOf("{");
  const arrStart = cleaned.indexOf("[");

  let start = -1;
  if (objStart === -1 && arrStart === -1) throw new Error("No JSON found in response");
  else if (objStart === -1) start = arrStart;
  else if (arrStart === -1) start = objStart;
  else start = Math.min(objStart, arrStart);

  const openChar = cleaned[start];
  const closeChar = openChar === "{" ? "}" : "]";
  const end = cleaned.lastIndexOf(closeChar);
  if (end === -1) throw new Error("Malformed JSON in response");

  const jsonStr = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch {
    const fixed = jsonStr.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(fixed);
  }
}

// Extract plain text from AI response — strips any JSON wrapping
export function extractPlainText(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // If the model returned JSON with a text field, extract it
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.coverLetter) return parsed.coverLetter;
    if (parsed.text) return parsed.text;
    if (parsed.letter) return parsed.letter;
    if (parsed.content) return parsed.content;
    // If it's a string value
    const firstValue = Object.values(parsed)[0];
    if (typeof firstValue === "string") return firstValue;
  } catch {
    // Not JSON — return as-is
  }
  return cleaned;
}
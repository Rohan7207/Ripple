export function parseAIResponse(response, fallback = {}) {
  if (!response || typeof response !== "string") {
    return fallback;
  }

  let cleaned = response.trim();

  // Remove markdown code fences if the model uses them
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Find JSON object inside any extra text
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);

    return {
      ...fallback,
      ...parsed,
    };
  } catch {
   

    return {
      ...fallback,
      raw: response,
    };
  }
}
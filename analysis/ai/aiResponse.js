export function parseAIResponse(response, fallback = {}) {
  if (!response || typeof response !== "string") {
    return fallback;
  }

  let cleaned = response
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Remove JavaScript-style comments from JSON output
  cleaned = cleaned.replace(
    /(^|["\s])\/\/.*$/gm,
    "$1"
  );

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      raw: response,
      ...fallback
    };
  }
}
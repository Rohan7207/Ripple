import { GroqProvider } from "./groqProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";

export async function askRipple(
  analysis,
  question
) {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const context =
    retrieveContext(
      analysis,
      question
    );

  const provider =
    new GroqProvider();

  const prompt = `
You are Ripple, a repository analysis assistant.

Answer the user's question using ONLY the repository evidence provided.

IMPORTANT EVIDENCE RULES:
- Treat sourceSnippets as primary implementation evidence.
- Treat symbols, files, relationships, and graph data as deterministic repository evidence.
- If an exact implementation snippet is present, use it directly.
- Never say that an implementation is "unavailable" when the supplied sourceSnippets contain that implementation.
- Never replace repository evidence with a generic explanation based only on a function name.
- Do not invent files, symbols, functions, dependencies, APIs, or relationships.
- Distinguish:
  1. OBSERVED EVIDENCE — explicitly present in the repository context.
  2. INFERENCE — a reasonable conclusion derived from observed evidence.
  3. UNKNOWN — not established by the supplied evidence.
- When source lines are shown as "line | code", use those line numbers when referring to implementation details.
- Mention the relevant file path for implementation claims.
- If the context does not contain enough evidence, say exactly what is missing.

USER QUESTION:
${question}

REPOSITORY CONTEXT:
${JSON.stringify(
  context,
  null,
  2
)}
`;

  const answer =
    await provider.generate(
      prompt,
      {
        temperature: 0
      }
    );

  return {
    question,
    answer,
    context
  };
}
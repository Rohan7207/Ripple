import { GroqProvider } from "./groqProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";

export async function askRipple(analysis, question) {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const context = retrieveContext(analysis, question);

  const provider = new GroqProvider();

  const prompt = `
You are Ripple, a repository analysis assistant.

Answer the user's question using only the repository evidence provided below.

Rules:
- Do not invent files, symbols, dependencies, or relationships.
- Mention relevant file paths and symbols when available.
- Clearly distinguish facts from reasonable inferences.
- If the evidence is insufficient, say so.
- Keep the answer concise and useful.

USER QUESTION:
${question}

REPOSITORY CONTEXT:
${JSON.stringify(context, null, 2)}
`;

  const answer = await provider.generate(prompt, {
    temperature: 0
  });

  return {
    question,
    answer,
    context
  };
}
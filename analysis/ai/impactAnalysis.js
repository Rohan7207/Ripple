import { GroqProvider } from "./groqProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";

export async function analyzeImpact(analysis, target) {
  if (!target || !target.trim()) {
    throw new Error("Impact target is required");
  }

  const context = retrieveContext(analysis, target);

  const provider = new GroqProvider();

  const prompt = `
You are Ripple, a repository impact-analysis assistant.

Determine the likely impact of changing the requested target using ONLY
the repository evidence provided below.

REQUESTED CHANGE:
${target}

REPOSITORY CONTEXT:
${JSON.stringify(context, null, 2)}

Rules:
- Never invent files, symbols, dependencies, or relationships.
- Identify directly affected files/symbols from the evidence.
- Clearly distinguish confirmed evidence from inference.
- If evidence is insufficient, say so.
- Do not modify or generate code.
- Keep the result concise and structured.

Return JSON with this structure:
{
  "summary": "short impact summary",
  "affectedFiles": [],
  "affectedSymbols": [],
  "relationships": [],
  "risks": [],
  "confidence": "HIGH | MEDIUM | LOW"
}
`;

  const answer = await provider.generate(prompt, {
    temperature: 0
  });

  return {
    target,
    answer,
    context
  };
}

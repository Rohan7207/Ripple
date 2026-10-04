import { GroqProvider } from "./groqProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

export async function analyzeWhatIf(analysis, scenario) {
  if (!scenario || !scenario.trim()) {
    throw new Error("What-if scenario is required");
  }

  const context = retrieveContext(analysis, scenario);

  const provider = new GroqProvider();

  const prompt = `
You are Ripple, a repository change-impact assistant.

Analyze the hypothetical change described below using ONLY the
repository evidence provided.

WHAT-IF SCENARIO:
${scenario}

REPOSITORY CONTEXT:
${JSON.stringify(context, null, 2)}

Rules:
- Do not invent files, symbols, dependencies, or relationships.
- Explain which existing repository elements may be affected.
- Clearly distinguish confirmed evidence from inference.
- If the evidence is insufficient, say so.
- Do not modify or generate code.
- Keep the result concise and structured.

Return JSON with this structure:
{
  "scenario": "short description",
  "likelyChanges": [],
  "affectedFiles": [],
  "affectedSymbols": [],
  "risks": [],
  "unknowns": [],
  "confidence": "HIGH | MEDIUM | LOW"
}
`;

  const answer = await provider.generate(prompt, {
    temperature: 0
  });

 const result = parseAIResponse(answer, {
  scenario,
  likelyChanges: [],
  affectedFiles: [],
  affectedSymbols: [],
  risks: [],
  unknowns: [],
  confidence: "LOW"
});

return {
  scenario,
  result,
  context
};
}

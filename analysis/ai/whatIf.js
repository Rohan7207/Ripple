import { GroqProvider } from "./groqProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

export async function analyzeWhatIf(
  analysis,
  scenario
) {
  if (!scenario || !scenario.trim()) {
    throw new Error(
      "What-if scenario is required"
    );
  }

  const context =
    retrieveContext(
      analysis,
      scenario
    );

  const provider =
    new GroqProvider();

  const prompt = `
You are Ripple, a repository change-impact assistant.

Analyze the hypothetical change described below using ONLY the
repository evidence provided.

WHAT-IF SCENARIO:
${scenario}

REPOSITORY CONTEXT:
${JSON.stringify(
  context,
  null,
  2
)}

Rules:

- Source snippets and deterministic relationships are the primary evidence.
- Clearly separate:
  1. OBSERVED EVIDENCE
  2. AI INFERENCE
  3. UNKNOWN / INSUFFICIENT EVIDENCE
- Do not invent files, symbols, dependencies, APIs, or relationships.
- Do not assume that a change in one layer automatically requires a change
  in every connected layer.
- For example, changing a service's returned object does NOT automatically
  mean a controller requires code changes if the controller simply forwards
  the service result unchanged.
- Only identify a controller as affected when repository evidence shows that
  the controller explicitly transforms, validates, destructures, reshapes,
  filters, or otherwise depends on the changed structure.
- Only identify downstream consumers when the deterministic graph or
  relationships establish the dependency.
- If the repository evidence does not establish a required change, put it
  under unknowns instead of asserting it.
- Explain which existing repository elements may be affected.
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

  const answer =
    await provider.generate(
      prompt,
      {
        temperature: 0
      }
    );

  const result =
    parseAIResponse(
      answer,
      {
        scenario,
        likelyChanges: [],
        affectedFiles: [],
        affectedSymbols: [],
        risks: [],
        unknowns: [],
        confidence: "LOW"
      }
    );

  return {
    scenario,
    result,
    context
  };
}
import { GeminiProvider } from "./geminiProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

export async function analyzeImpact(analysis, target) {
  if (!target || !target.trim()) {
    throw new Error("Impact target is required");
  }

  const context = retrieveContext(analysis, target);

  const aiContext = {
    ...context,
    files: context.files?.slice(0, 3) || [],
    symbols: context.symbols?.slice(0, 10) || [],
    relationships: context.relationships?.slice(0, 10) || [],
    sourceSnippets: context.sourceSnippets?.slice(0, 2) || [],
    graph: {
      nodes: context.graph?.nodes?.slice(0, 10) || [],
      edges: context.graph?.edges?.slice(0, 10) || [],
    },
  };

  const provider = new GeminiProvider();

  const prompt = `
You are Ripple, a repository impact-analysis assistant.

Determine the likely impact of changing the requested target using ONLY
the repository evidence provided below.

REQUESTED CHANGE:
${target}

REPOSITORY CONTEXT:
${JSON.stringify(aiContext, null, 2)}

Rules:

- Deterministic repository evidence is authoritative.
- Use sourceSnippets, symbols, relationships, and graph edges as evidence.
- Identify DIRECT impact only when directly connected to the requested target.
- Identify INDIRECT impact only when a deterministic relationship chain in the
  provided evidence establishes that connection.
- Identify RELATED areas only when the repository evidence establishes a
  meaningful relationship.
- Do not invent downstream consumers.
- Do not assume that every file mentioned in the architecture documentation
  is affected.
- Do not assume that changing a service automatically requires changing a
  controller.
- A controller should only be marked affected when the repository evidence
  shows that it transforms, validates, reshapes, or otherwise depends on the
  changed behavior.
- Never invent files, symbols, dependencies, APIs, or relationships.
- Clearly distinguish:
  OBSERVED EVIDENCE,
  INFERENCE,
  and
  UNKNOWN / INSUFFICIENT EVIDENCE.
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
    temperature: 0,
  });

  const result = parseAIResponse(answer, {
    summary: "",
    affectedFiles: [],
    affectedSymbols: [],
    relationships: [],
    risks: [],
    confidence: "LOW",
  });

  return {
    target,
    result,
    context,
  };
}

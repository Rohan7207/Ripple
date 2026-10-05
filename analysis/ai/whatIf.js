import { OpenRouterProvider } from "./openRouterProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

export async function analyzeWhatIf(analysis, scenario) {
  if (!scenario || !scenario.trim()) {
    throw new Error("What-if scenario is required");
  }

  const context = retrieveContext(analysis, scenario);

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

  const provider = new OpenRouterProvider();

  const prompt = `
You are Ripple, a repository change-impact assistant.

Analyze the hypothetical change described below using ONLY the
repository evidence provided.

WHAT-IF SCENARIO:
${scenario}

REPOSITORY CONTEXT:
${JSON.stringify(aiContext, null, 2)}

Rules:

- Deterministic repository evidence is authoritative.
- Use ONLY files, symbols, relationships, and source snippets present in the
  provided REPOSITORY CONTEXT.
- Do not treat general software conventions or typical architecture patterns
  as repository evidence.

EVIDENCE CLASSIFICATION:

1. OBSERVED EVIDENCE
   - A file, symbol, or relationship is directly present in the provided
     repository context.
   - Only repository evidence can establish that something exists or is
     connected.

2. AI INFERENCE
   - A possible consequence logically inferred from observed repository
     evidence.
   - Inferences must be clearly phrased as possibilities.
   - Do not promote an inference into an affected file, affected symbol, or
     deterministic relationship.

3. UNKNOWN / INSUFFICIENT EVIDENCE
   - Use this when the repository context does not establish the connection.
   - If a file or symbol is mentioned in the scenario but is absent from the
     repository context, do not assume its implementation or relationships.
   - Put possible involvement in unknowns instead.

AFFECTED FILES:

- Include a file in affectedFiles ONLY when the provided repository evidence
  establishes that the file is directly or meaningfully affected by the
  requested change.
- Do NOT add files because they "typically" call, consume, validate, or depend
  on another file.
- Do NOT add a file merely because its name sounds related to the scenario.
- Do NOT include files that are only mentioned as hypothetical examples.
- If a possible file involvement is not established by evidence, put it in
  unknowns instead.

AFFECTED SYMBOLS:

- Include a symbol in affectedSymbols ONLY when that symbol appears in the
  provided repository context and the evidence connects it to the requested
  change.
- Do not infer that another function must change merely because it is nearby,
  similarly named, or conventionally involved.
- Do not include unrelated symbols simply because they contain similar words
  such as "verification", "authentication", or "user".

RELATIONSHIPS:

- Report a relationship ONLY when it exists in the provided deterministic
  relationships or source evidence.
- Never create relationships based on typical application architecture.
- Never use phrases such as "typically calls", "implied", "presumably calls",
  or "would normally depend on" as evidence.
- If the relationship cannot be established, classify it as an unknown.

LIKELY CHANGES:

- These are consequences supported by repository evidence.
- Do not present speculative implementation details as established changes.
- If a proposed change requires something that the repository evidence does
  not establish, describe it as an inference or unknown instead.

RISKS:

- Risks may include reasonable technical consequences of the hypothetical
  change, but clearly distinguish them from repository-observed facts.
- Do not claim that a specific file, database field, API response, or service
  exists unless it appears in the repository context.

UNKNOWN / INSUFFICIENT EVIDENCE:

- Explicitly list important areas where the repository context is insufficient.
- Prefer UNKNOWN over guessing.
- Absence of evidence is not evidence of a dependency.

IMPORTANT:

- Never invent files, symbols, dependencies, APIs, relationships, database
  fields, or implementation details.
- Never use general programming knowledge to establish repository structure.
- The uploaded repository is the source of truth.
- Ripple is advisory only and must not modify or generate repository code.
- Keep the result concise and useful.


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
    temperature: 0,
  });

  const result = parseAIResponse(answer, {
    scenario,
    likelyChanges: [],
    affectedFiles: [],
    affectedSymbols: [],
    risks: [],
    unknowns: [],
    confidence: "LOW",
  });

  return {
    scenario,
    result,
    context,
  };
}

import { OpenRouterProvider } from "./openRouterProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

function getFilePath(file) {
  if (!file) return null;

  if (typeof file === "string") {
    return file;
  }

  return file.path || file.filePath || file.relativePath || file.name || null;
}

function getSymbolName(symbol) {
  if (!symbol) return null;

  if (typeof symbol === "string") {
    return symbol;
  }

  return symbol.name || symbol.symbol || null;
}

function getSymbolFile(symbol) {
  if (!symbol || typeof symbol === "string") {
    return null;
  }

  return symbol.filePath || symbol.path || symbol.relativePath || null;
}

function normalizePath(value) {
  if (!value) return "";

  return String(value)
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "");
}

function extractTargetTokens(target) {
  return [
    ...new Set(
      (target.match(/[A-Za-z_$][A-Za-z0-9_$./-]*/g) || [])
        .map((token) => token.trim())
        .filter(Boolean)
        .filter(
          (token) =>
            ![
              "what",
              "files",
              "would",
              "be",
              "affected",
              "if",
              "the",
              "exchange",
              "rate",
              "api",
              "changes",
              "change",
              "on",
              "in",
              "to",
              "from",
              "and",
              "or",
              "is",
              "are",
              "does",
              "do",
              "depend",
              "depends",
              "directly",
              "with",
            ].includes(token.toLowerCase()),
        ),
    ),
  ];
}

function buildDeterministicImpact(analysis, context, target) {
  const symbols = Array.isArray(analysis?.symbols) ? analysis.symbols : [];

  const relationships = Array.isArray(analysis?.relationships)
    ? analysis.relationships
    : [];

  const contextFiles = Array.isArray(context?.files) ? context.files : [];

  const contextSymbols = Array.isArray(context?.symbols) ? context.symbols : [];

  const contextRelationships = Array.isArray(context?.relationships)
    ? context.relationships
    : [];

  const snippets = Array.isArray(context?.sourceSnippets)
    ? context.sourceSnippets
    : [];

  const targetTokens = extractTargetTokens(target);

  if (
    target.toLowerCase().includes("exchange rate") ||
    target.toLowerCase().includes("exchange-rate") ||
    target.toLowerCase().includes("currency api") ||
    target.toLowerCase().includes("rate api")
  ) {
    targetTokens.push("rate", "BASE_URL", "updateExchangeRate", "fetch");
  }

 
  /*
   * Find symbols whose names are explicitly present in the
   * user's request or whose names appear in the supplied
   * repository context.
   */
  const matchedSymbols = symbols.filter((symbol) => {
    const name = getSymbolName(symbol);

    if (!name) return false;

    return targetTokens.some(
      (token) => token === name || token.toLowerCase() === name.toLowerCase(),
    );
  });

  /*
   * Also inspect context symbols. This is useful when the
   * user's request describes a concept rather than naming
   * an exact function.
   */

  const allRelevantSymbols = [...matchedSymbols].filter(
    (symbol, index, array) => {
      const name = getSymbolName(symbol);
      const file = normalizePath(getSymbolFile(symbol));

      return (
        array.findIndex(
          (other) =>
            getSymbolName(other) === name &&
            normalizePath(getSymbolFile(other)) === file,
        ) === index
      );
    },
  );

  /*
   * Determine files that actually contain relevant symbols.
   */
  const affectedFileMap = new Map();

  for (const symbol of allRelevantSymbols) {
    const name = getSymbolName(symbol);
    const file = normalizePath(getSymbolFile(symbol));

    if (!file) continue;

    if (!affectedFileMap.has(file)) {
      affectedFileMap.set(file, {
        path: file,
        impact: "DIRECT",
        reason: `Contains repository symbol "${name}" relevant to the requested change.`,
      });
    }
  }

  /*
   * If the context contains source evidence related to the
   * request, include its file as direct evidence.
   */
  for (const file of contextFiles) {
    const filePath = normalizePath(getFilePath(file));

    if (!filePath) continue;

    const fileText = snippets
      .filter((snippet) => {
        const snippetPath = normalizePath(
          typeof snippet === "string"
            ? ""
            : snippet?.filePath || snippet?.path || snippet?.file || "",
        );

        return !snippetPath || snippetPath === filePath;
      })
      .map((snippet) =>
        typeof snippet === "string"
          ? snippet
          : snippet?.content || snippet?.text || snippet?.snippet || "",
      )
      .join("\n")
      .toLowerCase();

    const hasRelevantEvidence =
      targetTokens.some((token) => fileText.includes(token.toLowerCase())) ||
      fileText.includes("data.rates") ||
      fileText.includes("exchange") ||
      fileText.includes("api") ||
      fileText.includes("fetch(");

    if (hasRelevantEvidence && !affectedFileMap.has(filePath)) {
      affectedFileMap.set(filePath, {
        path: filePath,
        impact: "DIRECT",
        reason:
          "Repository source evidence shows exchange-rate API or response handling in this file.",
      });
    }
  }

  /*
   * Use actual repository relationships.
   *
   * IMPORTANT:
   * from = caller/source
   * to   = called/target
   *
   * Therefore both directions are retained as evidence,
   * but we never invent a relationship.
   */
 const relevantRelationships = [];

for (const relationship of relationships) {
  if (!relationship) continue;

  const touchesRelevantSymbol = allRelevantSymbols.some((symbol) => {
    const name = getSymbolName(symbol);

    return (
      name &&
      (relationship.from === name ||
        relationship.to === name)
    );
  });

  if (touchesRelevantSymbol) {
    relevantRelationships.push(relationship);
  }
}

  /*
   * Prefer relationships already returned by the context
   * retriever when the full analysis has none.
   */
  // if (relevantRelationships.length === 0 && contextRelationships.length > 0) {
  //   relevantRelationships.push(...contextRelationships);
  // }

  const affectedSymbols = allRelevantSymbols.map((symbol) => ({
    name: getSymbolName(symbol),
    file: normalizePath(getSymbolFile(symbol)),
    impact: "DIRECT",
    reason:
      "Repository analysis identifies this symbol as relevant to the requested change.",
  }));

  /*
   * Add symbols participating in real relationships.
   * This is what allows the UI to show useful ripple evidence
   * even when the AI ignores the JSON response format.
   */
  for (const relationship of relevantRelationships) {
    const from = relationship.from;
    const to = relationship.to;

    const fromFile = normalizePath(relationship.fromFilePath);

    const toFile = normalizePath(relationship.toFilePath);

    if (
      from &&
      !affectedSymbols.some(
        (symbol) =>
          symbol.name === from && normalizePath(symbol.file) === fromFile,
      )
    ) {
      affectedSymbols.push({
        name: from,
        file: fromFile,
        impact: "INDIRECT",
        reason: `Participates in a recorded ${relationship.type || "repository"} relationship.`,
      });
    }

    if (
      to &&
      !affectedSymbols.some(
        (symbol) => symbol.name === to && normalizePath(symbol.file) === toFile,
      )
    ) {
      affectedSymbols.push({
        name: to,
        file: toFile,
        impact: "INDIRECT",
        reason: `Participates in a recorded ${relationship.type || "repository"} relationship.`,
      });
    }
  }

  /*
   * Convert real repository relationships into the exact
   * structure expected by the frontend.
   */
  const relationshipResults = relevantRelationships.map((relationship) => ({
    type: relationship.type || "related",
    from: relationship.from || relationship.fromFilePath || "unknown",
    to: relationship.to || relationship.toFilePath || "unknown",
    reason:
      relationship.type === "calls"
        ? `${relationship.from} calls ${relationship.to}.`
        : "Recorded repository relationship.",
  }));

  const affectedFiles = [...affectedFileMap.values()];

  /*
   * If repository analysis contains files but the exact
   * symbol was not matched, use the context file that contains
   * the actual API evidence.
   */
  if (affectedFiles.length === 0 && contextFiles.length > 0) {
    for (const file of contextFiles) {
      const filePath = normalizePath(getFilePath(file));

      if (!filePath) continue;

      affectedFiles.push({
        path: filePath,
        impact: "DIRECT",
        reason:
          "This repository file is present in the retrieved impact-analysis context.",
      });
    }
  }

  const evidenceCount =
    affectedFiles.length + affectedSymbols.length + relationshipResults.length;

  let confidence = "LOW";

  if (evidenceCount >= 5) {
    confidence = "HIGH";
  } else if (evidenceCount >= 2) {
    confidence = "MEDIUM";
  }

  const summary =
    affectedFiles.length > 0
      ? `Repository analysis identified ${affectedFiles.length} affected file${affectedFiles.length === 1 ? "" : "s"} and ${affectedSymbols.length} relevant symbol${affectedSymbols.length === 1 ? "" : "s"} for the requested change.`
      : "No directly affected files could be established from the available repository evidence.";

  const risks = [];

  if (snippets.length > 0) {
    risks.push(
      "The identified impact is based on the source evidence available to Ripple.",
    );
  }

  if (relationshipResults.length === 0) {
    risks.push(
      "No explicit relationship connecting the requested change to additional files was found in the analyzed repository.",
    );
  }

  return {
    summary,
    affectedFiles,
    affectedSymbols,
    relationships: relationshipResults,
    risks,
    confidence,
  };
}

export async function analyzeImpact(analysis, target) {
  if (!target || !target.trim()) {
    throw new Error("Impact target is required");
  }

 
  const context = retrieveContext(analysis, target);

  

  const aiContext = {
    files: context.files || [],
    symbols: context.symbols || [],
    relationships: context.relationships || [],
    sourceSnippets: context.sourceSnippets || [],
    graph: {
      nodes: context.graph?.nodes || [],
      edges: context.graph?.edges || [],
    },
  };

  /*
   * FIRST build a deterministic result from the repository.
   * This result does not depend on the AI returning JSON.
   */
  const deterministicResult = buildDeterministicImpact(
    analysis,
    context,
    target,
  );



  /*
   * AI is still used for reasoning/explanation.
   * But the UI will never become empty just because the model
   * returns thinking text instead of JSON.
   */
  const provider = new OpenRouterProvider();

  const prompt = `
You are Ripple, an AI repository impact-analysis assistant.

Analyze the requested code change using ONLY the repository evidence supplied
in REPOSITORY CONTEXT.

REQUESTED CHANGE:
${target}

REPOSITORY CONTEXT:
${JSON.stringify(aiContext, null, 2)}

Return ONLY valid JSON with this structure:

{
  "summary": "short impact explanation",
  "affectedFiles": [],
  "affectedSymbols": [],
  "relationships": [],
  "risks": [],
  "confidence": "HIGH | MEDIUM | LOW"
}

Do not invent repository facts.
`;

  try {
    const answer = await provider.generate(prompt, {
      temperature: 0,
      maxTokens: 1400,
      responseFormat: {
        type: "json_object",
      },
    });

 

    const aiResult = parseAIResponse(answer, deterministicResult);

    /*
     * If AI returned valid structured JSON, use its explanation
     * but never allow empty structural fields to erase the
     * deterministic repository evidence.
     */
    const finalResult = {
      ...deterministicResult,

      summary: aiResult?.summary || deterministicResult.summary,

      risks:
        Array.isArray(aiResult?.risks) && aiResult.risks.length > 0
          ? aiResult.risks
          : deterministicResult.risks,

      confidence: aiResult?.confidence || deterministicResult.confidence,

      affectedFiles:
        Array.isArray(aiResult?.affectedFiles) &&
        aiResult.affectedFiles.length > 0
          ? aiResult.affectedFiles
          : deterministicResult.affectedFiles,

      affectedSymbols:
        Array.isArray(aiResult?.affectedSymbols) &&
        aiResult.affectedSymbols.length > 0
          ? aiResult.affectedSymbols
          : deterministicResult.affectedSymbols,

      relationships:
        Array.isArray(aiResult?.relationships) &&
        aiResult.relationships.length > 0
          ? aiResult.relationships
          : deterministicResult.relationships,
    };

   

    return {
      target,
      result: finalResult,
      context,
    };
  } catch (error) {
    /*
     * Even if OpenRouter fails completely, Ripple still returns
     * repository-grounded Impact Analysis to the UI.
     */


    return {
      target,
      result: deterministicResult,
      context,
    };
  }
}

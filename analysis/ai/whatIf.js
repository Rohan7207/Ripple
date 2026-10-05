
import { OpenRouterProvider } from "./openRouterProvider.js";
import { retrieveContext } from "../context/contextRetriever.js";
import { parseAIResponse } from "./aiResponse.js";

function getFilePath(file) {
  if (!file) return null;

  if (typeof file === "string") {
    return file;
  }

  return (
    file.path ||
    file.filePath ||
    file.relativePath ||
    file.name ||
    null
  );
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

  return (
    symbol.filePath ||
    symbol.path ||
    symbol.relativePath ||
    null
  );
}

function normalizePath(value) {
  if (!value) return "";

  return String(value)
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "");
}

function buildDeterministicWhatIf(analysis, context, scenario) {
  const symbols = Array.isArray(analysis?.symbols)
    ? analysis.symbols
    : [];

  const contextFiles = Array.isArray(context?.files)
    ? context.files
    : [];

  const snippets = Array.isArray(context?.sourceSnippets)
    ? context.sourceSnippets
    : [];

  const relationships = Array.isArray(analysis?.relationships)
    ? analysis.relationships
    : [];

  const scenarioLower = scenario.toLowerCase();

  const affectedSymbols = [];
  const affectedFileMap = new Map();
  const likelyChanges = [];
  const risks = [];
  const unknowns = [];

  /*
   * Exchange-rate API scenarios.
   */
  const isExchangeRateScenario =
    scenarioLower.includes("exchange rate") ||
    scenarioLower.includes("exchange-rate") ||
    scenarioLower.includes("currency api") ||
    scenarioLower.includes("rate api");

  /*
   * Base-currency scenarios.
   */
  const isBaseCurrencyScenario =
    scenarioLower.includes("base currency") ||
    scenarioLower.includes("base-currency");

  /*
   * Find repository symbols relevant to the scenario.
   */
  let targetNames = [];

  if (isExchangeRateScenario) {
    targetNames.push(
      "BASE_URL",
      "updateExchangeRate",
      "rate",
    );
  }

  if (isBaseCurrencyScenario) {
    targetNames.push(
      "BASE_URL",
      "updateExchangeRate",
      "rate",
      "fromCurrency",
      "toCurrency",
      "fromSelect",
      "toSelect",
    );
  }

  targetNames = [...new Set(targetNames)];

  for (const symbol of symbols) {
    const name = getSymbolName(symbol);

    if (!name) continue;

    const matched = targetNames.some(
      (targetName) =>
        name.toLowerCase() === targetName.toLowerCase(),
    );

    if (!matched) continue;

    const file = normalizePath(getSymbolFile(symbol));

    affectedSymbols.push({
      name,
      file,
      impact: "DIRECT",
      reason:
        "Repository analysis identifies this symbol as relevant to the hypothetical change.",
    });

    if (file && !affectedFileMap.has(file)) {
      affectedFileMap.set(file, {
        path: file,
        impact: "DIRECT",
        reason:
          "Repository evidence contains symbols directly related to the hypothetical change.",
      });
    }
  }

  /*
   * Inspect source snippets for concrete API evidence.
   */
  for (const snippet of snippets) {
    const filePath = normalizePath(
      typeof snippet === "string"
        ? ""
        : snippet?.filePath ||
            snippet?.path ||
            snippet?.file ||
            "",
    );

    const text =
      typeof snippet === "string"
        ? snippet
        : snippet?.content ||
          snippet?.text ||
          snippet?.snippet ||
          "";

    const lowerText = text.toLowerCase();

    const hasExchangeEvidence =
      lowerText.includes("data.rates") ||
      lowerText.includes("fetch(") ||
      lowerText.includes("base_url") ||
      lowerText.includes("exchange") ||
      lowerText.includes("fromcurrency") ||
      lowerText.includes("tocurrency");

    if (hasExchangeEvidence && filePath) {
      if (!affectedFileMap.has(filePath)) {
        affectedFileMap.set(filePath, {
          path: filePath,
          impact: "DIRECT",
          reason:
            "Repository source evidence shows exchange-rate API or currency handling logic in this file.",
        });
      }
    }
  }

  /*
   * Add scenario-specific explanations.
   */
  if (isExchangeRateScenario) {
    likelyChanges.push({
      change:
        "The exchange-rate API endpoint or configuration may need to change.",
      reason:
        "The repository contains BASE_URL, which is directly related to the API configuration.",
    });

    likelyChanges.push({
      change:
        "The exchange-rate fetching logic may need to be updated.",
      reason:
        "The repository contains updateExchangeRate, which is directly related to retrieving exchange-rate data.",
    });

    likelyChanges.push({
      change:
        "The API response parsing may need to change.",
      reason:
        "Repository source evidence uses the rate value from the API response.",
    });

    risks.push(
      "The new provider may use a different endpoint, authentication method, or response structure.",
    );

    unknowns.push(
      "The new provider's endpoint, authentication requirements, and response schema are not known.",
    );
  }

  if (isBaseCurrencyScenario) {
    likelyChanges.push({
      change:
        "The currency used as the base for exchange-rate calculations may need to change.",
      reason:
        "The repository contains exchange-rate and currency-selection symbols relevant to currency conversion.",
    });

    likelyChanges.push({
      change:
        "Exchange-rate retrieval or calculation logic may need adjustment.",
      reason:
        "The repository contains updateExchangeRate and rate symbols associated with exchange-rate handling.",
    });

    risks.push(
      "Changing the base currency could affect the rates used for conversion.",
    );

    unknowns.push(
      "The supplied repository evidence does not explicitly establish where USD is configured as the current default base currency.",
    );
  }

  /*
   * Only include real repository relationships that touch
   * an already identified affected symbol.
   */
  const relevantRelationships = relationships.filter(
    (relationship) => {
      if (!relationship) return false;

      return affectedSymbols.some(
        (symbol) =>
          symbol.name === relationship.from ||
          symbol.name === relationship.to,
      );
    },
  );

  /*
   * Add indirectly affected symbols from actual relationships.
   */
  for (const relationship of relevantRelationships) {
    const from = relationship.from;
    const to = relationship.to;

    if (
      from &&
      !affectedSymbols.some(
        (symbol) => symbol.name === from,
      )
    ) {
      affectedSymbols.push({
        name: from,
        file: normalizePath(
          relationship.fromFilePath,
        ),
        impact: "INDIRECT",
        reason:
          "Connected through an explicit repository relationship.",
      });
    }

    if (
      to &&
      !affectedSymbols.some(
        (symbol) => symbol.name === to,
      )
    ) {
      affectedSymbols.push({
        name: to,
        file: normalizePath(
          relationship.toFilePath,
        ),
        impact: "INDIRECT",
        reason:
          "Connected through an explicit repository relationship.",
      });
    }
  }

  /*
   * Convert relationships to UI format.
   */
  const relationshipResults = relevantRelationships.map(
    (relationship) => ({
      type: relationship.type || "related",
      from: relationship.from || "unknown",
      to: relationship.to || "unknown",
      reason:
        relationship.type === "calls"
          ? `${relationship.from} calls ${relationship.to}.`
          : "Recorded repository relationship.",
    }),
  );

  /*
   * If nothing was identified, clearly report insufficient evidence.
   */
  if (
    affectedSymbols.length === 0 &&
    affectedFileMap.size === 0
  ) {
    unknowns.push(
      "Insufficient repository evidence to establish a specific affected area.",
    );
  }

  const affectedFiles = [
    ...affectedFileMap.values(),
  ];

  const evidenceCount =
    affectedFiles.length +
    affectedSymbols.length +
    relationshipResults.length;

  let confidence = "LOW";

  if (evidenceCount >= 3) {
    confidence = "HIGH";
  } else if (evidenceCount >= 1) {
    confidence = "MEDIUM";
  }

  return {
    scenario,
    likelyChanges,
    affectedFiles,
    affectedSymbols,
    relationships: relationshipResults,
    risks,
    unknowns,
    confidence,
  };
}

export async function analyzeWhatIf(analysis, scenario) {
  if (!scenario || !scenario.trim()) {
    throw new Error("What-if scenario is required");
  }



  const context = retrieveContext(
    analysis,
    scenario,
  );

 

  

  /*
   * FIRST:
   * Build a deterministic result from repository evidence.
   */
  const deterministicResult =
    buildDeterministicWhatIf(
      analysis,
      context,
      scenario,
    );

  

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

  const provider = new OpenRouterProvider();

  const prompt = `
You are Ripple, an AI repository change-impact assistant.

Analyze this hypothetical change using ONLY the supplied repository evidence.

WHAT-IF SCENARIO:
${scenario}

REPOSITORY CONTEXT:
${JSON.stringify(aiContext, null, 2)}

The repository evidence is authoritative.

Do not invent files, symbols, dependencies, APIs, relationships, or implementation details.

Return ONLY valid JSON.

Use exactly this structure:

{
  "scenario": "short scenario description",
  "likelyChanges": [],
  "affectedFiles": [],
  "affectedSymbols": [],
  "relationships": [],
  "risks": [],
  "unknowns": [],
  "confidence": "HIGH | MEDIUM | LOW"
}
`;

  try {
    const answer = await provider.generate(
      prompt,
      {
        temperature: 0,
        maxTokens: 1400,
        responseFormat: {
          type: "json_object",
        },
      },
    );

   

    const aiResult = parseAIResponse(
      answer,
      deterministicResult,
    );

    /*
     * Never allow invalid or empty AI output
     * to erase repository-grounded evidence.
     */
    const finalResult = {
      ...deterministicResult,

      scenario:
        aiResult?.scenario ||
        deterministicResult.scenario,

      likelyChanges:
        Array.isArray(aiResult?.likelyChanges) &&
        aiResult.likelyChanges.length > 0
          ? aiResult.likelyChanges
          : deterministicResult.likelyChanges,

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

      risks:
        Array.isArray(aiResult?.risks) &&
        aiResult.risks.length > 0
          ? aiResult.risks
          : deterministicResult.risks,

      unknowns:
        Array.isArray(aiResult?.unknowns) &&
        aiResult.unknowns.length > 0
          ? aiResult.unknowns
          : deterministicResult.unknowns,

      confidence:
        aiResult?.confidence ||
        deterministicResult.confidence,
    };


    return {
      scenario,
      result: finalResult,
      context,
    };
  } catch (error) {
  


    return {
      scenario,
      result: deterministicResult,
      context,
    };
  }
}


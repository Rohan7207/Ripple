import { discoverFiles } from "./discovery/fileDiscovery.js";
import { extractSymbols } from "./symbols/symbolExtractor.js";
import { extractRelationships } from "./relationships/relationshipExtractor.js";
import { buildGraph } from "./graph/graphBuilder.js";

export async function analyzeRepository(repositoryPath, options = {}) {
  const { onProgress } = options;

  // --------------------------------------------------
  // Progress reporting helper
  // --------------------------------------------------

  function reportProgress(progress, stage) {
    if (typeof onProgress !== "function") {
      return;
    }

    try {
      onProgress({
        progress,
        stage,
      });
    } catch {
      // Progress reporting must never break analysis
    }
  }

  // --------------------------------------------------
  // Stage 1: Repository discovery
  // --------------------------------------------------

  reportProgress(0, "EXTRACTING");

  const discovery = discoverFiles(repositoryPath);

  const files = discovery.files || [];
  const directories = discovery.directories || [];
  const warnings = [...(discovery.warnings || [])];

  reportProgress(20, "ANALYZING_FILES");

  // --------------------------------------------------
  // Stage 2: Symbol extraction
  // --------------------------------------------------

  const symbols = [];

  reportProgress(25, "ANALYZING_SYMBOLS");

  for (const file of files) {
    if (file.language !== "JavaScript" && file.language !== "TypeScript") {
      continue;
    }

    try {
      const fileSymbols = extractSymbols(file.absolutePath, file.language);

      for (const symbol of fileSymbols) {
        symbols.push({
          ...symbol,
          filePath: file.path,
        });
      }
    } catch (error) {
      warnings.push(
        `Symbol analysis failed for ${file.path}: ${error.message}`,
      );
    }
  }

  reportProgress(40, "ANALYZING_SYMBOLS");

  // --------------------------------------------------
  // Stage 3: Relationship extraction
  // --------------------------------------------------

  const relationships = [];

  reportProgress(45, "ANALYZING_RELATIONSHIPS");

  for (const file of files) {
    if (file.language !== "JavaScript" && file.language !== "TypeScript") {
      continue;
    }

    try {
      const fileRelationships = extractRelationships(
        file.absolutePath,
        file.language,
        {
          repositoryPath,
          files,
          symbols,
        },
      );

      relationships.push(...fileRelationships);
    } catch (error) {
      warnings.push(
        `Relationship analysis failed for ${file.path}: ${error.message}`,
      );
    }
  }

  reportProgress(60, "ANALYZING_RELATIONSHIPS");

  // --------------------------------------------------
  // Stage 4: Graph construction
  // --------------------------------------------------

  reportProgress(65, "BUILDING_GRAPH");

  let graph = {
    nodes: [],
    edges: [],
  };

  try {
    graph = buildGraph(files, symbols, relationships);
  } catch (error) {
    warnings.push(`Graph construction failed: ${error.message}`);
  }

  reportProgress(85, "BUILDING_GRAPH");

  // --------------------------------------------------
  // Languages
  // --------------------------------------------------

  const languages = [
    ...new Set(
      files
        .map((file) => file.language)
        .filter((language) => language !== "Unknown"),
    ),
  ];

  // --------------------------------------------------
  // Final analysis result
  // --------------------------------------------------

  const result = {
    files,
    directories,
    symbols,
    relationships,
    graph,
    languages,
    statistics: {
      files: files.length,
      directories: directories.length,
      symbols: symbols.length,
      relationships: relationships.length,
    },
    analysis: {
      coverage: warnings.length === 0 ? "FULL" : "PARTIAL",
      warnings,
    },
  };

  // --------------------------------------------------
  // Stage 5: Finalizing
  // --------------------------------------------------

  reportProgress(95, "FINALIZING");

  return result;
}

import { discoverFiles } from "./discovery/fileDiscovery.js";
import { extractSymbols } from "./symbols/symbolExtractor.js";
import { extractRelationships } from "./relationships/relationshipExtractor.js";
import { buildGraph } from "./graph/graphBuilder.js";

export async function analyzeRepository(repositoryPath) {
  const discovery = discoverFiles(repositoryPath);

  const files = discovery.files || [];
  const directories = discovery.directories || [];
  const warnings = [...(discovery.warnings || [])];

  // --------------------------------------------------
  // Symbol extraction
  // --------------------------------------------------

  const symbols = [];

  for (const file of files) {
    if (
      file.language !== "JavaScript" &&
      file.language !== "TypeScript"
    ) {
      continue;
    }

    try {
      const fileSymbols = extractSymbols(
        file.absolutePath,
        file.language
      );

      for (const symbol of fileSymbols) {
        symbols.push({
          ...symbol,
          filePath: file.path
        });
      }
    } catch (error) {
      warnings.push(
        `Symbol analysis failed for ${file.path}: ${error.message}`
      );
    }
  }

  // --------------------------------------------------
  // Relationship extraction
  // --------------------------------------------------

  const relationships = [];

  for (const file of files) {
    if (
      file.language !== "JavaScript" &&
      file.language !== "TypeScript"
    ) {
      continue;
    }

    try {
      const fileRelationships = extractRelationships(
        file.absolutePath,
        file.language,
        {
          repositoryPath,
          files,
          symbols
        }
      );

      relationships.push(
        ...fileRelationships
      );
    } catch (error) {
      warnings.push(
        `Relationship analysis failed for ${file.path}: ${error.message}`
      );
    }
  }

  // --------------------------------------------------
  // Graph construction
  // --------------------------------------------------

  let graph = {
    nodes: [],
    edges: []
  };

  try {
    graph = buildGraph(
      files,
      symbols,
      relationships
    );
  } catch (error) {
    warnings.push(
      `Graph construction failed: ${error.message}`
    );
  }

  // --------------------------------------------------
  // Languages
  // --------------------------------------------------

  const languages = [
    ...new Set(
      files
        .map((file) => file.language)
        .filter(
          (language) => language !== "Unknown"
        )
    )
  ];

  // --------------------------------------------------
  // Final analysis result
  // --------------------------------------------------

  return {
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
      relationships: relationships.length
    },
    analysis: {
      coverage:
        warnings.length === 0
          ? "FULL"
          : "PARTIAL",
      warnings
    }
  };
}
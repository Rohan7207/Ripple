import { discoverFiles } from "./discovery/fileDiscovery.js";
import { extractSymbols } from "./symbols/symbolExtractor.js";
import { extractRelationships } from "./relationships/relationshipExtractor.js";
import { buildGraph } from "./graph/graphBuilder.js";

export async function analyzeRepository(rootDir) {
  const warnings = [];

  let discovery;

  try {
    discovery = discoverFiles(rootDir);
  } catch (error) {
    return {
      files: [],
      directories: [],
      symbols: [],
      relationships: [],
      graph: {
        nodes: [],
        edges: []
      },
      languages: [],
      statistics: {
        files: 0,
        directories: 0,
        symbols: 0,
        relationships: 0
      },
      analysis: {
        coverage: "FAILED",
        warnings: [
          `Repository discovery failed: ${error.message}`
        ]
      }
    };
  }

  const files = discovery.files;
  const directories = discovery.directories;

  warnings.push(...discovery.warnings);

  const symbols = [];
  const relationships = [];

  /*
   * Symbol extraction
   */
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

  /*
   * Relationship extraction
   */
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
        file.language
      );

      for (const relationship of fileRelationships) {
        relationships.push({
          ...relationship,
          filePath: file.path
        });
      }
    } catch (error) {
      warnings.push(
        `Relationship analysis failed for ${file.path}: ${error.message}`
      );
    }
  }

  /*
   * Graph construction
   */
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

  const languages = [
    ...new Set(
      files
        .map((file) => file.language)
        .filter(
          (language) => language !== "Unknown"
        )
    )
  ];

  const hasUnsupportedSource = files.some(
    (file) =>
      file.type === "source" &&
      !["JavaScript", "TypeScript"].includes(
        file.language
      )
  );

  if (hasUnsupportedSource) {
    warnings.push(
      "Some source files use languages that are not deeply analyzed yet."
    );
  }

  const coverage =
    warnings.length === 0
      ? "FULL"
      : "PARTIAL";

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
      coverage,
      warnings
    }
  };
}
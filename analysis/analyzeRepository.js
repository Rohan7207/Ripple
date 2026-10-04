import { discoverFiles } from "./discovery/fileDiscovery.js";
import { extractSymbols } from "./symbols/symbolExtractor.js";
import { extractRelationships } from "./relationships/relationshipExtractor.js";
import { buildGraph } from "./graph/graphBuilder.js";

export async function analyzeRepository(repositoryPath) {
  const discovery = discoverFiles(repositoryPath);

  const files = discovery.files || [];
  const directories = discovery.directories || [];
  const warnings = [...(discovery.warnings || [])];

  const symbols = [];
  const relationships = [];

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

      const fileRelationships = extractRelationships(
        file.absolutePath,
        file.language,
      );

      relationships.push(...fileRelationships);
    } catch (error) {
      warnings.push(
        `Symbol analysis failed for ${file.path}: ${error.message}`,
      );
    }
  }

  const languages = [
    ...new Set(
      files
        .map((file) => file.language)
        .filter((language) => language !== "Unknown"),
    ),
  ];

  const graph = buildGraph(files, symbols, relationships);

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
      relationships: relationships.length,
    },
    analysis: {
      coverage: warnings.length === 0 ? "FULL" : "PARTIAL",
      warnings,
    },
  };
}

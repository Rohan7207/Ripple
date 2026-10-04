import { discoverFiles } from "./discovery/fileDiscovery.js";
import { extractSymbols } from "./symbols/symbolExtractor.js";

export async function analyzeRepository(repositoryPath) {
  const discovery = discoverFiles(repositoryPath);

  const files = discovery.files || [];
  const directories = discovery.directories || [];
  const warnings = [...(discovery.warnings || [])];

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

  const languages = [
    ...new Set(
      files
        .map((file) => file.language)
        .filter((language) => language !== "Unknown")
    )
  ];

  return {
    files,
    directories,
    symbols,
    relationships: [],
    graph: {
      nodes: [],
      edges: []
    },
    languages,
    statistics: {
      files: files.length,
      directories: directories.length,
      symbols: symbols.length,
      relationships: 0
    },
    analysis: {
      coverage: warnings.length === 0 ? "FULL" : "PARTIAL",
      warnings
    }
  };
}
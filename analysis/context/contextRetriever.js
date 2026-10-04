export function retrieveContext(analysis, query = "") {
  if (!analysis) {
    return {
      files: [],
      symbols: [],
      relationships: [],
      graph: {
        nodes: [],
        edges: []
      }
    };
  }

  const normalizedQuery = query.trim().toLowerCase();

  // If there is no query, return the complete deterministic context.
  if (!normalizedQuery) {
    return {
      files: analysis.files || [],
      symbols: analysis.symbols || [],
      relationships: analysis.relationships || [],
      graph: analysis.graph || {
        nodes: [],
        edges: []
      }
    };
  }

  // Find files related to the query.
  const relevantFiles = (analysis.files || []).filter((file) => {
    const searchableText = [
      file.path,
      file.name,
      file.language,
      file.type
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  const relevantPaths = new Set(
    relevantFiles.map((file) => file.path)
  );

  // Find symbols belonging to relevant files.
  const relevantSymbols = (analysis.symbols || []).filter(
    (symbol) => {
      const searchableText = [
        symbol.name,
        symbol.type,
        symbol.filePath
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(normalizedQuery) ||
        relevantPaths.has(symbol.filePath)
      );
    }
  );

  // Keep relationships connected to relevant files/symbols.
  const relevantSymbolNames = new Set(
    relevantSymbols.map((symbol) => symbol.name)
  );

  const relevantRelationships = (
    analysis.relationships || []
  ).filter((relationship) => {
    return (
      relevantPaths.has(relationship.filePath) ||
      relevantPaths.has(relationship.from) ||
      relevantPaths.has(relationship.to) ||
      relevantSymbolNames.has(relationship.from) ||
      relevantSymbolNames.has(relationship.to)
    );
  });

  return {
    files: relevantFiles,
    symbols: relevantSymbols,
    relationships: relevantRelationships,
    graph: analysis.graph || {
      nodes: [],
      edges: []
    }
  };
}
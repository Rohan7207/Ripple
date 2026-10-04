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

  const queryTerms = normalizedQuery
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9_./-]/g, ""))
    .filter((term) => term.length >= 3);

  const matchesQuery = (text) => {
    if (!text) return false;

    const normalizedText = text.toLowerCase();

    return queryTerms.some((term) =>
      normalizedText.includes(term)
    );
  };

  // Find files that directly match the query
  const directlyRelevantFiles = (analysis.files || []).filter(
    (file) => {
      return [
        file.path,
        file.name,
        file.language,
        file.type
      ]
        .filter(Boolean)
        .some(matchesQuery);
    }
  );

  // Find symbols that directly match the query
  const directlyRelevantSymbols = (
    analysis.symbols || []
  ).filter((symbol) => {
    return [
      symbol.name,
      symbol.type,
      symbol.filePath
    ]
      .filter(Boolean)
      .some(matchesQuery);
  });

  // Include files containing matched symbols
  const relevantPaths = new Set([
    ...directlyRelevantFiles.map((file) => file.path),
    ...directlyRelevantSymbols
      .map((symbol) => symbol.filePath)
      .filter(Boolean)
  ]);

  const relevantFiles = (analysis.files || []).filter(
    (file) => relevantPaths.has(file.path)
  );

  // Include symbols belonging to relevant files
  const relevantSymbols = (analysis.symbols || []).filter(
    (symbol) => {
      return (
        relevantPaths.has(symbol.filePath) ||
        directlyRelevantSymbols.includes(symbol)
      );
    }
  );

  const relevantSymbolNames = new Set(
    relevantSymbols.map((symbol) => symbol.name)
  );

  // Include relationships connected to relevant files/symbols
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
function buildGraph(files, symbols, relationships) {
  const nodes = [];
  const edges = [];

  const nodeIds = new Set();

  function addNode(id, type, data = {}) {
    if (nodeIds.has(id)) {
      return;
    }

    nodeIds.add(id);

    nodes.push({
      id,
      type,
      ...data
    });
  }

  function addEdge(source, target, type, data = {}) {
    if (!source || !target) {
      return;
    }

    // Never create an edge to a node that does not exist.
    if (!nodeIds.has(source) || !nodeIds.has(target)) {
      return;
    }

    const exists = edges.some(
      (edge) =>
        edge.source === source &&
        edge.target === target &&
        edge.type === type
    );

    if (exists) {
      return;
    }

    edges.push({
      source,
      target,
      type,
      ...data
    });
  }

  // --------------------------------------------------
  // File nodes
  // --------------------------------------------------

  for (const file of files || []) {
    if (!file.path) {
      continue;
    }

    addNode(
      `file:${file.path}`,
      "file",
      {
        name: file.name,
        path: file.path,
        language: file.language,
        fileType: file.type
      }
    );
  }

  // --------------------------------------------------
  // Symbol nodes
  // --------------------------------------------------

  for (const symbol of symbols || []) {
    const filePath =
      symbol.filePath || symbol.path;

    if (!filePath || !symbol.name) {
      continue;
    }

    const symbolId =
      `symbol:${filePath}:${symbol.name}`;

    addNode(
      symbolId,
      symbol.type,
      {
        name: symbol.name,
        filePath,
        startLine: symbol.startLine,
        endLine: symbol.endLine
      }
    );

    addEdge(
      `file:${filePath}`,
      symbolId,
      "contains"
    );
  }

  // --------------------------------------------------
  // Relationship edges
  // --------------------------------------------------

  for (const relationship of relationships || []) {
    if (!relationship.type) {
      continue;
    }

    // ----------------------------------------------
    // File → File relationships
    // ----------------------------------------------

    if (
      relationship.type === "imports" ||
      relationship.type === "exports"
    ) {
      const fromFilePath =
        relationship.fromFilePath ||
        relationship.from;

      const toFilePath =
        relationship.toFilePath ||
        relationship.to;

      if (!fromFilePath || !toFilePath) {
        continue;
      }

      addEdge(
        `file:${fromFilePath}`,
        `file:${toFilePath}`,
        relationship.type
      );

      continue;
    }

    // ----------------------------------------------
    // Symbol → Symbol relationships
    // ----------------------------------------------

    if (
      relationship.type === "calls" ||
      relationship.type === "references"
    ) {
      const fromFilePath =
        relationship.fromFilePath;

      const toFilePath =
        relationship.toFilePath;

      const fromSymbol =
        relationship.from;

      const toSymbol =
        relationship.to;

      if (
        !fromFilePath ||
        !toFilePath ||
        !fromSymbol ||
        !toSymbol
      ) {
        continue;
      }

      const sourceId =
        `symbol:${fromFilePath}:${fromSymbol}`;

      const targetId =
        `symbol:${toFilePath}:${toSymbol}`;

      addEdge(
        sourceId,
        targetId,
        relationship.type
      );
    }
  }

  return {
    nodes,
    edges
  };
}

export { buildGraph };
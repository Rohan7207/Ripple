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

    edges.push({
      source,
      target,
      type,
      ...data
    });
  }

  // File nodes
  for (const file of files || []) {
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

  // Symbol nodes
  for (const symbol of symbols || []) {
    const filePath = symbol.filePath || symbol.path;

    if (!filePath) {
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

  // Relationship edges
  for (const relationship of relationships || []) {
    if (
      relationship.type === "imports" ||
      relationship.type === "exports"
    ) {
      addEdge(
        `file:${relationship.from}`,
        `file:${relationship.to}`,
        relationship.type
      );

      continue;
    }

    if (
      relationship.type === "calls" ||
      relationship.type === "references"
    ) {
      addEdge(
        `symbol:${relationship.from}`,
        `symbol:${relationship.to}`,
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
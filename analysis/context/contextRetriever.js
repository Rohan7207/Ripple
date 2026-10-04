import fs from "node:fs";
import { sanitizeSecrets } from "../security/secretSanitizer.js";

const MAX_DIRECT_FILES = 3;
const MAX_RELATED_FILES = 3;
const MAX_FILES = 6;

const MAX_DIRECT_SYMBOLS = 10;
const MAX_SYMBOLS = 20;

const MAX_RELATIONSHIPS = 25;

const MAX_SNIPPETS = 4;
const MAX_SNIPPET_CHARS = 1200;
const MAX_TOTAL_SNIPPET_CHARS = 4000;

const MAX_GRAPH_NODES = 20;
const MAX_GRAPH_EDGES = 25;

const MAX_RELATIONSHIP_HOPS = 2;

const STOP_WORDS = new Set([
  "what",
  "does",
  "do",
  "how",
  "why",
  "where",
  "when",
  "which",
  "who",
  "can",
  "could",
  "would",
  "should",
  "is",
  "are",
  "the",
  "this",
  "that",
  "these",
  "those",
  "a",
  "an",
  "and",
  "or",
  "for",
  "from",
  "to",
  "of",
  "in",
  "on",
  "with",
  "by",
  "change",
  "changes",
  "changed",
  "changing",
  "update",
  "updates",
  "updated",
  "modify",
  "modified",
  "remove",
  "delete",
  "add",
  "fix",
  "handle",
  "handling",
  "implement",
  "implementation",
  "return",
  "returns",
  "returning"
]);

function emptyContext() {
  return {
    files: [],
    symbols: [],
    relationships: [],
    sourceSnippets: [],
    graph: {
      nodes: [],
      edges: []
    }
  };
}

/*
 * Preserve identifier casing.
 *
 * Example:
 * "What does getRepositoryFiles do?"
 *
 * produces:
 *   getRepositoryFiles
 *
 * rather than losing camelCase information.
 */
function extractQueryTerms(query) {
  const tokens =
    query.match(
      /[A-Za-z_$][A-Za-z0-9_$./-]*/g
    ) || [];

  return [
    ...new Set(
      tokens
        .map((token) => token.trim())
        .filter(Boolean)
        .filter(
          (token) =>
            !STOP_WORDS.has(
              token.toLowerCase()
            )
        )
    )
  ];
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function exactMatch(value, term) {
  return (
    normalize(value) ===
    normalize(term)
  );
}

function containsMatch(value, term) {
  const text = normalize(value);
  const search = normalize(term);

  if (!text || !search) {
    return false;
  }

  return text.includes(search);
}

function isLowPriorityFile(file) {
  const filePath = normalize(
    file.path || file.name
  );

  return (
    filePath.includes("/test") ||
    filePath.includes("\\test") ||
    filePath.includes(".test.") ||
    filePath.includes(".spec.") ||
    filePath.includes("__tests__") ||
    filePath.endsWith(".md") ||
    filePath.includes("/docs/") ||
    filePath.includes("\\docs\\")
  );
}

function isImplementationFile(file) {
  if (!file) {
    return false;
  }

  const language =
    normalize(file.language);

  return (
    language === "javascript" ||
    language === "typescript"
  );
}

function getCodeOnly(content) {
  return content
    .replace(
      /\/\*[\s\S]*?\*\//g,
      " "
    )
    .replace(
      /\/\/.*$/gm,
      " "
    )
    .replace(
      /"(?:\\.|[^"\\])*"/g,
      " "
    )
    .replace(
      /'(?:\\.|[^'\\])*'/g,
      " "
    )
    .replace(
      /`(?:\\.|[^`\\])*`/g,
      " "
    );
}

function getLineNumberForText(
  content,
  term
) {
  if (!content || !term) {
    return null;
  }

  const lines =
    content.split(/\r?\n/);

  const normalizedTerm =
    normalize(term);

  for (let i = 0; i < lines.length; i += 1) {
    if (
      normalize(lines[i]).includes(
        normalizedTerm
      )
    ) {
      return i + 1;
    }
  }

  return null;
}

function getSymbolLine(symbol) {
  return (
    symbol.startLine ||
    symbol.line ||
    symbol.loc?.start?.line ||
    null
  );
}

function getSymbolMatchScore(
  symbol,
  queryTerms
) {
  if (!symbol?.name) {
    return 0;
  }

  let score = 0;

  for (const term of queryTerms) {
    if (
      exactMatch(
        symbol.name,
        term
      )
    ) {
      score += 1000;
      continue;
    }

    if (
      containsMatch(
        symbol.name,
        term
      )
    ) {
      score += 100;
    }
  }

  return score;
}

function getFileMatchScore(
  file,
  queryTerms
) {
  if (!file) {
    return 0;
  }

  let score = 0;

  for (const term of queryTerms) {
    if (
      exactMatch(
        file.name,
        term
      )
    ) {
      score += 800;
    }

    if (
      exactMatch(
        file.path,
        term
      )
    ) {
      score += 800;
    }

    if (
      containsMatch(
        file.name,
        term
      )
    ) {
      score += 150;
    }

    if (
      containsMatch(
        file.path,
        term
      )
    ) {
      score += 150;
    }
  }

  return score;
}

function getSourceMatchScore(
  code,
  queryTerms
) {
  if (!code) {
    return 0;
  }

  let score = 0;

  for (const term of queryTerms) {
    const escaped =
      term.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const regex =
      new RegExp(
        `\\b${escaped}\\b`,
        "i"
      );

    if (regex.test(code)) {
      score += 30;
    }
  }

  return score;
}

function getRelevantSymbolNames(
  symbols
) {
  return new Set(
    symbols
      .map(
        (symbol) =>
          symbol.name
      )
      .filter(Boolean)
  );
}

/*
 * Relationship neighbor discovery.
 *
 * Starting from the directly relevant files,
 * follow deterministic relationships for at most
 * MAX_RELATIONSHIP_HOPS hops.
 *
 * This gives us:
 * - direct dependencies
 * - indirect dependencies
 *
 * without walking the entire repository.
 */
function discoverRelatedFiles(
  relationships,
  directPaths
) {
  const distances =
    new Map();

  for (const path of directPaths) {
    distances.set(
      path,
      0
    );
  }

  let frontier = [
    ...directPaths
  ];

  for (
    let hop = 1;
    hop <= MAX_RELATIONSHIP_HOPS;
    hop += 1
  ) {
    const nextFrontier =
      [];

    for (const relationship of relationships) {
      const from =
        relationship.fromFilePath;

      const to =
        relationship.toFilePath;

      if (!from || !to) {
        continue;
      }

      for (const currentPath of frontier) {
        let neighbor = null;

        if (from === currentPath) {
          neighbor = to;
        } else if (to === currentPath) {
          neighbor = from;
        }

        if (!neighbor) {
          continue;
        }

        if (
          distances.has(
            neighbor
          )
        ) {
          continue;
        }

        distances.set(
          neighbor,
          hop
        );

        nextFrontier.push(
          neighbor
        );
      }
    }

    frontier = [
      ...new Set(
        nextFrontier
      )
    ];

    if (
      frontier.length === 0
    ) {
      break;
    }
  }

  return distances;
}

function buildSelectedRelationships(
  relationships,
  selectedPaths,
  directPaths,
  directSymbolNames
) {
  const directPathSet =
    new Set(directPaths);

  const selectedPathSet =
    new Set(selectedPaths);

  return relationships
    .filter(
      (relationship) => {
        const fromPath =
          relationship.fromFilePath;

        const toPath =
          relationship.toFilePath;

        const touchesSelected =
          (
            fromPath &&
            selectedPathSet.has(
              fromPath
            )
          ) ||
          (
            toPath &&
            selectedPathSet.has(
              toPath
            )
          );

        if (!touchesSelected) {
          return false;
        }

        const directConnection =
          (
            fromPath &&
            directPathSet.has(
              fromPath
            )
          ) ||
          (
            toPath &&
            directPathSet.has(
              toPath
            )
          );

        const symbolConnection =
          (
            relationship.from &&
            directSymbolNames.has(
              relationship.from
            )
          ) ||
          (
            relationship.to &&
            directSymbolNames.has(
              relationship.to
            )
          );

        return (
          directConnection ||
          symbolConnection
        );
      }
    )
    .slice(
      0,
      MAX_RELATIONSHIPS
    );
}

function selectSourceSnippet(
  file,
  selectedSymbols,
  queryTerms
) {
  if (
    !file?.absolutePath ||
    !fs.existsSync(
      file.absolutePath
    )
  ) {
    return null;
  }

  try {
    const rawContent =
      fs.readFileSync(
        file.absolutePath,
        "utf8"
      );

    if (!rawContent.trim()) {
      return null;
    }

    const sanitized =
      sanitizeSecrets(
        rawContent
      );

    const lines =
      sanitized.split(/\r?\n/);

    const fileSymbols =
      selectedSymbols.filter(
        (symbol) =>
          symbol.filePath ===
          file.path
      );

    let centerLine = null;

    /*
     * First preference:
     * actual symbol location.
     */
    for (const symbol of fileSymbols) {
      const line =
        getSymbolLine(symbol);

      if (
        Number.isInteger(line) &&
        line > 0
      ) {
        centerLine = line;
        break;
      }
    }

    /*
     * Fallback:
     * search the actual implementation source
     * for the exact requested identifier.
     */
    if (!centerLine) {
      const codeOnly =
        getCodeOnly(
          sanitized
        );

      for (const term of queryTerms) {
        const line =
          getLineNumberForText(
            codeOnly,
            term
          );

        if (line) {
          centerLine = line;
          break;
        }
      }
    }

    /*
     * Final fallback for a related file:
     * first portion only.
     */
    if (!centerLine) {
      const snippet =
        sanitized.slice(
          0,
          MAX_SNIPPET_CHARS
        );

      if (!snippet.trim()) {
        return null;
      }

      return {
        filePath: file.path,
        content: snippet
      };
    }

    const startLine =
      Math.max(
        1,
        centerLine - 5
      );

    const endLine =
      Math.min(
        lines.length,
        centerLine + 20
      );

    const numberedLines =
      lines
        .slice(
          startLine - 1,
          endLine
        )
        .map(
          (line, index) =>
            `${startLine + index} | ${line}`
        )
        .join("\n");

    const snippet =
      numberedLines.slice(
        0,
        MAX_SNIPPET_CHARS
      );

    if (!snippet.trim()) {
      return null;
    }

    return {
      filePath: file.path,
      content: snippet
    };
  } catch {
    return null;
  }
}

export function retrieveContext(
  analysis,
  query = ""
) {
  if (!analysis) {
    return emptyContext();
  }

  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return emptyContext();
  }

  const queryTerms =
    extractQueryTerms(
      normalizedQuery
    );

  if (
    queryTerms.length === 0
  ) {
    return emptyContext();
  }

  // --------------------------------------------------
  // 1. Exact symbol discovery
  // --------------------------------------------------

  const rankedSymbols =
    (analysis.symbols || [])
      .map((symbol) => ({
        symbol,
        score:
          getSymbolMatchScore(
            symbol,
            queryTerms
          )
      }))
      .filter(
        (entry) =>
          entry.score > 0
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const directSymbols =
    rankedSymbols
      .slice(
        0,
        MAX_DIRECT_SYMBOLS
      )
      .map(
        (entry) =>
          entry.symbol
      );

  const directSymbolNames =
    getRelevantSymbolNames(
      directSymbols
    );

  // --------------------------------------------------
  // 2. Rank implementation files
  // --------------------------------------------------

  const rankedFiles =
    (analysis.files || [])
      .map((file) => {
        let score =
          getFileMatchScore(
            file,
            queryTerms
          );

        // Exact symbol ownership is strong evidence.
        const fileSymbols =
          (analysis.symbols || [])
            .filter(
              (symbol) =>
                symbol.filePath ===
                file.path
            );

        for (const symbol of fileSymbols) {
          score +=
            getSymbolMatchScore(
              symbol,
              queryTerms
            );
        }

        /*
         * Only inspect source for implementation files.
         * Do not use arbitrary prose in docs/tests as
         * implementation evidence.
         */
        if (
          isImplementationFile(
            file
          ) &&
          file.absolutePath &&
          fs.existsSync(
            file.absolutePath
          )
        ) {
          try {
            const rawContent =
              fs.readFileSync(
                file.absolutePath,
                "utf8"
              );

            const codeOnly =
              getCodeOnly(
                rawContent
              );

            score +=
              getSourceMatchScore(
                codeOnly,
                queryTerms
              );
          } catch {
            // Ignore unreadable files.
          }
        }

        /*
         * Documentation and tests can still be returned
         * if they are reached through a real relationship,
         * but they should not win direct implementation
         * selection.
         */
        if (
          isLowPriorityFile(
            file
          )
        ) {
          score -= 250;
        }

        return {
          file,
          score
        };
      })
      .filter(
        (entry) =>
          entry.score > 0
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const directFiles =
    rankedFiles
      .slice(
        0,
        MAX_DIRECT_FILES
      )
      .map(
        (entry) =>
          entry.file
      );

  /*
   * If an exact symbol was found, make sure its file
   * is always represented in direct files.
   */
  const directPathSet =
    new Set(
      directFiles
        .map(
          (file) =>
            file.path
        )
        .filter(Boolean)
    );

  for (const symbol of directSymbols) {
    if (
      !symbol.filePath ||
      directPathSet.has(
        symbol.filePath
      )
    ) {
      continue;
    }

    const file =
      (analysis.files || [])
        .find(
          (candidate) =>
            candidate.path ===
            symbol.filePath
        );

    if (!file) {
      continue;
    }

    if (
      directFiles.length <
      MAX_DIRECT_FILES
    ) {
      directFiles.push(
        file
      );

      directPathSet.add(
        file.path
      );
    }
  }

  /*
   * No direct evidence means no invented context.
   */
  if (
    directFiles.length === 0 &&
    directSymbols.length === 0
  ) {
    return emptyContext();
  }

  // --------------------------------------------------
  // 3. Direct paths
  // --------------------------------------------------

  const directPaths =
    new Set(
      directFiles
        .map(
          (file) =>
            file.path
        )
        .filter(Boolean)
    );

  for (const symbol of directSymbols) {
    if (symbol.filePath) {
      directPaths.add(
        symbol.filePath
      );
    }
  }

  // --------------------------------------------------
  // 4. Deterministic relationship traversal
  // --------------------------------------------------

  const relationshipDistances =
    discoverRelatedFiles(
      analysis.relationships || [],
      directPaths
    );

  const relatedCandidates =
    [...relationshipDistances.entries()]
      .filter(
        ([filePath, distance]) =>
          distance > 0 &&
          !directPaths.has(
            filePath
          )
      )
      .sort(
        (a, b) => {
          return (
            a[1] - b[1]
          );
        }
      )
      .slice(
        0,
        MAX_RELATED_FILES
      )
      .map(
        ([filePath]) =>
          filePath
      );

  const selectedPathSet =
    new Set([
      ...directPaths,
      ...relatedCandidates
    ]);

  const selectedFiles =
    (analysis.files || [])
      .filter(
        (file) =>
          selectedPathSet.has(
            file.path
          )
      )
      .sort(
        (a, b) => {
          const aDirect =
            directPaths.has(
              a.path
            );

          const bDirect =
            directPaths.has(
              b.path
            );

          if (
            aDirect &&
            !bDirect
          ) {
            return -1;
          }

          if (
            !aDirect &&
            bDirect
          ) {
            return 1;
          }

          return 0;
        }
      )
      .slice(
        0,
        MAX_FILES
      );

  // --------------------------------------------------
  // 5. Relevant symbols
  // --------------------------------------------------

  const selectedSymbols =
    (analysis.symbols || [])
      .filter(
        (symbol) =>
          symbol.filePath &&
          selectedPathSet.has(
            symbol.filePath
          )
      )
      .sort(
        (a, b) => {
          const aDirect =
            directSymbolNames.has(
              a.name
            );

          const bDirect =
            directSymbolNames.has(
              b.name
            );

          if (
            aDirect &&
            !bDirect
          ) {
            return -1;
          }

          if (
            !aDirect &&
            bDirect
          ) {
            return 1;
          }

          const aQueryScore =
            getSymbolMatchScore(
              a,
              queryTerms
            );

          const bQueryScore =
            getSymbolMatchScore(
              b,
              queryTerms
            );

          return (
            bQueryScore -
            aQueryScore
          );
        }
      )
      .slice(
        0,
        MAX_SYMBOLS
      );

  const selectedSymbolNames =
    getRelevantSymbolNames(
      selectedSymbols
    );

  // --------------------------------------------------
  // 6. Relevant relationships
  // --------------------------------------------------

  const selectedRelationships =
    buildSelectedRelationships(
      analysis.relationships || [],
      selectedPathSet,
      directPaths,
      directSymbolNames
    );

  // --------------------------------------------------
  // 7. Focused source snippets
  // --------------------------------------------------

  const sourceSnippets = [];

  let totalSnippetChars = 0;

  const orderedFiles =
    [...selectedFiles].sort(
      (a, b) => {
        const aDirect =
          directPaths.has(
            a.path
          );

        const bDirect =
          directPaths.has(
            b.path
          );

        if (
          aDirect &&
          !bDirect
        ) {
          return -1;
        }

        if (
          !aDirect &&
          bDirect
        ) {
          return 1;
        }

        return 0;
      }
    );

  for (const file of orderedFiles) {
    if (
      sourceSnippets.length >=
      MAX_SNIPPETS
    ) {
      break;
    }

    const snippet =
      selectSourceSnippet(
        file,
        selectedSymbols,
        queryTerms
      );

    if (!snippet) {
      continue;
    }

    if (
      totalSnippetChars +
        snippet.content.length >
      MAX_TOTAL_SNIPPET_CHARS
    ) {
      break;
    }

    sourceSnippets.push(
      snippet
    );

    totalSnippetChars +=
      snippet.content.length;
  }

  // --------------------------------------------------
  // 8. Small graph limited to selected paths
  // --------------------------------------------------

  const graph =
    analysis.graph || {
      nodes: [],
      edges: []
    };

  const selectedGraphNodes =
    (graph.nodes || [])
      .filter(
        (node) => {
          const nodePath =
            node.filePath ||
            node.path;

          return (
            nodePath &&
            selectedPathSet.has(
              nodePath
            )
          );
        }
      )
      .slice(
        0,
        MAX_GRAPH_NODES
      );

  const selectedNodeIds =
    new Set(
      selectedGraphNodes
        .map(
          (node) =>
            node.id
        )
        .filter(Boolean)
    );

  const selectedGraphEdges =
    (graph.edges || [])
      .filter(
        (edge) =>
          selectedNodeIds.has(
            edge.source
          ) &&
          selectedNodeIds.has(
            edge.target
          )
      )
      .slice(
        0,
        MAX_GRAPH_EDGES
      );

  // --------------------------------------------------
  // 9. Compact context returned to AI
  // --------------------------------------------------

  return {
    files:
      selectedFiles.map(
        (file) => ({
          path:
            file.path,
          name:
            file.name,
          language:
            file.language,
          type:
            file.type
        })
      ),

    symbols:
      selectedSymbols.map(
        (symbol) => ({
          name:
            symbol.name,
          type:
            symbol.type,
          filePath:
            symbol.filePath,
          line:
            getSymbolLine(
              symbol
            )
        })
      ),

    relationships:
      selectedRelationships.map(
        (relationship) => ({
          type:
            relationship.type,
          from:
            relationship.from,
          to:
            relationship.to,
          fromFilePath:
            relationship.fromFilePath,
          toFilePath:
            relationship.toFilePath
        })
      ),

    sourceSnippets,

    graph: {
      nodes:
        selectedGraphNodes.map(
          (node) => ({
            id:
              node.id,
            name:
              node.name,
            type:
              node.type,
            filePath:
              node.filePath ||
              node.path
          })
        ),

      edges:
        selectedGraphEdges.map(
          (edge) => ({
            source:
              edge.source,
            target:
              edge.target,
            type:
              edge.type
          })
        )
    }
  };
}
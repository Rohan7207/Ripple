import fs from "node:fs";
import { sanitizeSecrets } from "../security/secretSanitizer.js";

const MAX_DIRECT_FILES = 3;
const MAX_RELATED_FILES = 3;
const MAX_FILES = 6;

const MAX_SYMBOLS = 20;
const MAX_RELATIONSHIPS = 25;

const MAX_SNIPPETS = 4;
const MAX_SNIPPET_CHARS = 800;
const MAX_TOTAL_SNIPPET_CHARS = 3200;

const MAX_GRAPH_NODES = 20;
const MAX_GRAPH_EDGES = 25;

const STOP_WORDS = new Set([
  "change",
  "changes",
  "update",
  "updates",
  "modify",
  "delete",
  "remove",
  "add",
  "fix",
  "handle",
  "handling",
  "implement",
  "implementation",
  "make",
  "using",
  "with",
  "the",
  "this",
  "that",
  "for",
  "from",
  "into",
  "to",
  "of",
  "in",
  "on",
  "and",
  "or"
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

function normalizeTerms(query) {
  return query
    .split(/\s+/)
    .map((term) =>
      term
        .replace(/[^a-z0-9_./-]/g, "")
        .toLowerCase()
    )
    .filter(
      (term) =>
        term.length >= 3 &&
        !STOP_WORDS.has(term)
    );
}

/*
 * These aliases are ONLY used for:
 * - file paths
 * - file names
 * - symbol names
 *
 * They are NOT used to scan arbitrary source code.
 * This prevents false positives.
 */
function getAliasTerms(term) {
  const aliases = new Set([term]);

  if (term === "authentication") {
    aliases.add("auth");
    aliases.add("authenticate");
    aliases.add("authenticated");
    aliases.add("login");
    aliases.add("signin");
  }

  if (term === "authorization") {
    aliases.add("auth");
    aliases.add("authorize");
    aliases.add("authorized");
    aliases.add("permission");
    aliases.add("role");
  }

  if (term === "jwt") {
    aliases.add("jsonwebtoken");
  }

  if (term === "login") {
    aliases.add("signin");
    aliases.add("sign-in");
  }

  if (term === "logout") {
    aliases.add("signout");
    aliases.add("sign-out");
  }

  return [...aliases];
}

function matchesWholeWord(text, term) {
  if (!text || !term) {
    return false;
  }

  const escapedTerm = term.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`,
    "i"
  );

  return regex.test(String(text));
}

function scoreValues(values = [], terms = []) {
  let score = 0;

  for (const value of values) {
    if (!value) {
      continue;
    }

    const text = String(value).toLowerCase();

    for (const term of terms) {
      if (matchesWholeWord(text, term)) {
        score += 1;
      }
    }
  }

  return score;
}

function isLowPriorityFile(file) {
  const filePath = String(
    file.path || file.name || ""
  ).toLowerCase();

  return (
    filePath.includes("test") ||
    filePath.includes("__tests__") ||
    filePath.includes(".spec.") ||
    filePath.includes(".test.") ||
    filePath.endsWith(".md") ||
    filePath.includes("/docs/") ||
    filePath.includes("\\docs\\")
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

export function retrieveContext(
  analysis,
  query = ""
) {
  if (!analysis) {
    return emptyContext();
  }

  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return emptyContext();
  }

  const queryTerms =
    normalizeTerms(normalizedQuery);

  if (queryTerms.length === 0) {
    return emptyContext();
  }

  // --------------------------------------------------
  // 1. Build aliases for paths / symbols only
  // --------------------------------------------------

  const aliasTerms = [
    ...new Set(
      queryTerms.flatMap(getAliasTerms)
    )
  ];

  // --------------------------------------------------
  // 2. Find DIRECT implementation candidates
  // --------------------------------------------------

  const rankedFiles =
    (analysis.files || [])
      .map((file) => {
        let score = 0;

        const pathValues = [
          file.path,
          file.name
        ];

        // Exact requested terms in path/name
        score +=
          scoreValues(
            pathValues,
            queryTerms
          ) * 30;

        // Aliases only in path/name
        score +=
          scoreValues(
            pathValues,
            aliasTerms
          ) * 10;

        // Symbols belonging to this file
        const fileSymbols =
          (analysis.symbols || [])
            .filter(
              (symbol) =>
                symbol.filePath ===
                file.path
            );

        // Exact requested terms in symbols
        score +=
          scoreValues(
            fileSymbols.map(
              (symbol) =>
                symbol.name
            ),
            queryTerms
          ) * 25;

        // Aliases in symbols
        score +=
          scoreValues(
            fileSymbols.map(
              (symbol) =>
                symbol.name
            ),
            aliasTerms
          ) * 8;

        /*
         * Search SOURCE CODE only for the user's
         * original terms.
         *
         * Do NOT search aliases here.
         *
         * Example:
         * "JWT authentication"
         *
         * "auth" appearing in App.jsx should NOT
         * automatically make App.jsx relevant.
         */
        if (
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
              getCodeOnly(rawContent);

            score +=
              scoreValues(
                [codeOnly],
                queryTerms
              ) * 15;
          } catch {
            // Ignore unreadable files
          }
        }

        // Strong penalty for docs/tests
        if (
          isLowPriorityFile(file)
        ) {
          score -= 50;
        }

        return {
          file,
          score
        };
      })
      .filter(
        (entry) =>
          entry.score >= 15
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
   * IMPORTANT:
   * If no implementation file has strong
   * evidence, do not force unrelated files
   * into the context.
   */
  if (directFiles.length === 0) {
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

  // --------------------------------------------------
  // 4. Direct symbols
  // --------------------------------------------------

  const directSymbols =
    (analysis.symbols || [])
      .map((symbol) => ({
        symbol,
        score:
          scoreValues(
            [symbol.name],
            queryTerms
          ) * 30 +
          scoreValues(
            [
              symbol.name,
              symbol.filePath
            ],
            aliasTerms
          ) * 8
      }))
      .filter(
        (entry) =>
          entry.score > 0 &&
          directPaths.has(
            entry.symbol.filePath
          )
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(
        0,
        10
      )
      .map(
        (entry) =>
          entry.symbol
      );

  const directSymbolNames =
    new Set(
      directSymbols
        .map(
          (symbol) =>
            symbol.name
        )
        .filter(Boolean)
    );

  // --------------------------------------------------
  // 5. Find closely related files through
  //    deterministic relationships ONLY
  // --------------------------------------------------

  const relatedScores =
    new Map();

  for (const relationship of
    analysis.relationships || []) {
    const fromPath =
      relationship.fromFilePath;

    const toPath =
      relationship.toFilePath;

    let relatedPath = null;
    let score = 0;

    if (
      directPaths.has(fromPath) &&
      toPath &&
      !directPaths.has(toPath)
    ) {
      relatedPath = toPath;
      score += 20;
    }

    if (
      directPaths.has(toPath) &&
      fromPath &&
      !directPaths.has(fromPath)
    ) {
      relatedPath = fromPath;
      score += 20;
    }

    if (!relatedPath) {
      continue;
    }

    if (
      directSymbolNames.has(
        relationship.from
      )
    ) {
      score += 10;
    }

    if (
      directSymbolNames.has(
        relationship.to
      )
    ) {
      score += 10;
    }

    const existing =
      relatedScores.get(
        relatedPath
      ) || 0;

    relatedScores.set(
      relatedPath,
      Math.max(
        existing,
        score
      )
    );
  }

  const relatedPaths =
    [...relatedScores.entries()]
      .filter(
        ([, score]) =>
          score >= 20
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(
        0,
        MAX_RELATED_FILES
      )
      .map(
        ([filePath]) =>
          filePath
      );

  // --------------------------------------------------
  // 6. Final files
  // --------------------------------------------------

  const selectedPathSet =
    new Set([
      ...directPaths,
      ...relatedPaths
    ]);

  const selectedFiles =
    (analysis.files || [])
      .filter(
        (file) =>
          selectedPathSet.has(
            file.path
          )
      )
      .slice(
        0,
        MAX_FILES
      );

  // --------------------------------------------------
  // 7. Symbols from selected files
  // --------------------------------------------------

  const selectedSymbols =
    (analysis.symbols || [])
      .filter(
        (symbol) =>
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

          return 0;
        }
      )
      .slice(
        0,
        MAX_SYMBOLS
      );

  const selectedSymbolNames =
    new Set(
      selectedSymbols
        .map(
          (symbol) =>
            symbol.name
        )
        .filter(Boolean)
    );

  // --------------------------------------------------
  // 8. Relationships connecting selected files
  // --------------------------------------------------

  const selectedRelationships =
    (analysis.relationships || [])
      .filter(
        (relationship) => {
          const fileMatch =
            (
              relationship.fromFilePath &&
              selectedPathSet.has(
                relationship.fromFilePath
              )
            ) ||
            (
              relationship.toFilePath &&
              selectedPathSet.has(
                relationship.toFilePath
              )
            );

          const symbolMatch =
            selectedSymbolNames.has(
              relationship.from
            ) ||
            selectedSymbolNames.has(
              relationship.to
            );

          return (
            fileMatch ||
            symbolMatch
          );
        }
      )
      .slice(
        0,
        MAX_RELATIONSHIPS
      );

  // --------------------------------------------------
  // 9. Focused source snippets
  // --------------------------------------------------

  const sourceSnippets = [];

  let totalSnippetChars = 0;

  for (const file of selectedFiles) {
    if (
      sourceSnippets.length >=
      MAX_SNIPPETS
    ) {
      break;
    }

    if (
      !file.absolutePath ||
      !fs.existsSync(
        file.absolutePath
      )
    ) {
      continue;
    }

    try {
      const rawContent =
        fs.readFileSync(
          file.absolutePath,
          "utf8"
        );

      const sanitizedContent =
        sanitizeSecrets(
          rawContent
        );

      const lines =
        sanitizedContent.split(
          /\r?\n/
        );

      const fileSymbols =
        selectedSymbols.filter(
          (symbol) =>
            symbol.filePath ===
            file.path
        );

      let snippet = "";

      const symbolLines =
        fileSymbols
          .map(
            (symbol) =>
              symbol.startLine ||
              symbol.line ||
              symbol.loc?.start?.line
          )
          .filter(
            (line) =>
              Number.isInteger(
                line
              ) &&
              line > 0
          );

      if (
        symbolLines.length > 0
      ) {
        const startLine =
          Math.max(
            1,
            Math.min(
              ...symbolLines
            ) - 4
          );

        const endLine =
          Math.min(
            lines.length,
            Math.max(
              ...symbolLines
            ) + 12
          );

        snippet =
          lines
            .slice(
              startLine - 1,
              endLine
            )
            .join("\n");
      }

      if (!snippet.trim()) {
        snippet =
          sanitizedContent.slice(
            0,
            MAX_SNIPPET_CHARS
          );
      }

      snippet =
        snippet.slice(
          0,
          MAX_SNIPPET_CHARS
        );

      if (!snippet.trim()) {
        continue;
      }

      if (
        totalSnippetChars +
          snippet.length >
        MAX_TOTAL_SNIPPET_CHARS
      ) {
        break;
      }

      sourceSnippets.push({
        filePath:
          file.path,
        content:
          snippet
      });

      totalSnippetChars +=
        snippet.length;
    } catch {
      // Ignore source retrieval failure
    }
  }

  // --------------------------------------------------
  // 10. Small graph
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
  // 11. Compact AI context
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
            symbol.startLine ||
            symbol.line ||
            symbol.loc?.start?.line
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
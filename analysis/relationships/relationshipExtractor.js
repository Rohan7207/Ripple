import fs from "node:fs";
import path from "node:path";
import * as parser from "@babel/parser";

const BUILTIN_FUNCTIONS = new Set([
  "Array",
  "Boolean",
  "Date",
  "Error",
  "JSON",
  "Map",
  "Math",
  "Number",
  "Object",
  "Promise",
  "RegExp",
  "Set",
  "String",
  "Symbol",
  "console",
  "parseInt",
  "parseFloat",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval"
]);

function resolveImportPath(filePath, importPath, repositoryPath, files) {
  if (!importPath || !importPath.startsWith(".")) {
    return null;
  }

  const absoluteImportPath = path.resolve(
    path.dirname(filePath),
    importPath
  );

  const candidates = [
    absoluteImportPath,
    `${absoluteImportPath}.js`,
    `${absoluteImportPath}.jsx`,
    `${absoluteImportPath}.ts`,
    `${absoluteImportPath}.tsx`,
    path.join(absoluteImportPath, "index.js"),
    path.join(absoluteImportPath, "index.ts")
  ];

  const matchingFile = files.find((file) =>
    candidates.includes(path.resolve(file.absolutePath))
  );

  if (!matchingFile) {
    return null;
  }

  return path
    .relative(repositoryPath, matchingFile.absolutePath)
    .replace(/\\/g, "/");
}

function extractRelationships(
  filePath,
  language,
  options = {}
) {
  if (!["JavaScript", "TypeScript"].includes(language)) {
    return [];
  }

  const {
    repositoryPath,
    files = [],
    symbols = []
  } = options;

  let content;

  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return [];
  }

  let ast;

  try {
    ast = parser.parse(content, {
      sourceType: "unambiguous",
      plugins: [
        "jsx",
        "typescript",
        "classProperties",
        "objectRestSpread",
        "optionalChaining",
        "dynamicImport"
      ]
    });
  } catch {
    return [];
  }

  const relationships = [];

  const relativeFilePath = repositoryPath
    ? path
        .relative(repositoryPath, filePath)
        .replace(/\\/g, "/")
    : filePath.replace(/\\/g, "/");

  const fileSymbols = symbols.filter(
    (symbol) =>
      symbol.filePath === relativeFilePath
  );

  const localSymbols = new Set(
    fileSymbols.map((symbol) => symbol.name)
  );

  const symbolIndex = new Map();

  for (const symbol of symbols) {
    if (!symbol.name || !symbol.filePath) {
      continue;
    }

    const key = symbol.name;

    if (!symbolIndex.has(key)) {
      symbolIndex.set(key, []);
    }

    symbolIndex.get(key).push(symbol);
  }

  const imports = new Map();

  function addRelationship(type, from, to, extra = {}) {
    if (!from || !to || from === to) {
      return;
    }

    const exists = relationships.some(
      (relationship) =>
        relationship.type === type &&
        relationship.from === from &&
        relationship.to === to &&
        relationship.fromFilePath === extra.fromFilePath &&
        relationship.toFilePath === extra.toFilePath
    );

    if (exists) {
      return;
    }

    relationships.push({
      type,
      from,
      to,
      ...extra
    });
  }

  function getFunctionName(node) {
    if (!node) {
      return null;
    }

    if (node.type === "FunctionDeclaration") {
      return node.id?.name || null;
    }

    if (
      node.type === "VariableDeclarator" &&
      node.id?.type === "Identifier" &&
      node.init &&
      (
        node.init.type === "FunctionExpression" ||
        node.init.type === "ArrowFunctionExpression"
      )
    ) {
      return node.id.name;
    }

    return null;
  }

  function resolveSymbol(name, preferredFilePath = null) {
    const candidates = symbolIndex.get(name) || [];

    if (preferredFilePath) {
      const exact = candidates.find(
        (symbol) =>
          symbol.filePath === preferredFilePath
      );

      if (exact) {
        return exact;
      }
    }

    if (candidates.length === 1) {
      return candidates[0];
    }

    return null;
  }

  function walk(node, currentFunction = null) {
    if (!node || typeof node !== "object") {
      return;
    }

    let activeFunction = currentFunction;

    const functionName = getFunctionName(node);

    if (functionName) {
      activeFunction = functionName;
    }

    switch (node.type) {
      case "ImportDeclaration": {
        const source = node.source?.value;

        if (!source) {
          break;
        }

        const resolvedPath = repositoryPath
          ? resolveImportPath(
              filePath,
              source,
              repositoryPath,
              files
            )
          : null;

        if (resolvedPath) {
          addRelationship(
            "imports",
            relativeFilePath,
            resolvedPath,
            {
              fromFilePath: relativeFilePath,
              toFilePath: resolvedPath
            }
          );
        }

        node.specifiers?.forEach((specifier) => {
          const importedName =
            specifier.imported?.name ||
            specifier.imported?.value ||
            "default";

          const localName =
            specifier.local?.name;

          if (!localName || !resolvedPath) {
            return;
          }

          imports.set(localName, {
            importedName,
            filePath: resolvedPath
          });
        });

        break;
      }

      case "ExportNamedDeclaration": {
        if (
          node.source?.value &&
          repositoryPath
        ) {
          const resolvedPath = resolveImportPath(
            filePath,
            node.source.value,
            repositoryPath,
            files
          );

          if (resolvedPath) {
            addRelationship(
              "exports",
              relativeFilePath,
              resolvedPath,
              {
                fromFilePath: relativeFilePath,
                toFilePath: resolvedPath
              }
            );
          }
        }

        break;
      }

      case "CallExpression": {
        if (
          !activeFunction ||
          node.callee?.type !== "Identifier"
        ) {
          break;
        }

        const calledName = node.callee.name;

        if (BUILTIN_FUNCTIONS.has(calledName)) {
          break;
        }

        const imported = imports.get(calledName);

        if (imported) {
          const targetSymbol = resolveSymbol(
            imported.importedName,
            imported.filePath
          );

          if (targetSymbol) {
            addRelationship(
              "calls",
              activeFunction,
              targetSymbol.name,
              {
                fromFilePath: relativeFilePath,
                toFilePath: targetSymbol.filePath
              }
            );
          }

          break;
        }

        if (localSymbols.has(calledName)) {
          const targetSymbol = resolveSymbol(
            calledName,
            relativeFilePath
          );

          if (targetSymbol) {
            addRelationship(
              "calls",
              activeFunction,
              targetSymbol.name,
              {
                fromFilePath: relativeFilePath,
                toFilePath: targetSymbol.filePath
              }
            );
          }

          break;
        }

        const targetSymbol = resolveSymbol(calledName);

        if (targetSymbol) {
          addRelationship(
            "calls",
            activeFunction,
            targetSymbol.name,
            {
              fromFilePath: relativeFilePath,
              toFilePath: targetSymbol.filePath
            }
          );
        }

        break;
      }
    }

    for (const key of Object.keys(node)) {
      if (
        key === "loc" ||
        key === "start" ||
        key === "end"
      ) {
        continue;
      }

      const value = node[key];

      if (Array.isArray(value)) {
        value.forEach((child) => {
          walk(child, activeFunction);
        });
      } else if (
        value &&
        typeof value === "object"
      ) {
        walk(value, activeFunction);
      }
    }
  }

  walk(ast);

  return relationships;
}

export { extractRelationships };
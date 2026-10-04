const fs = require("fs");
const parser = require("@babel/parser");

function extractSymbols(filePath, language) {
  if (!["JavaScript", "TypeScript"].includes(language)) {
    return [];
  }

  let content;

  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (error) {
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
  } catch (error) {
    return [];
  }

  const symbols = [];

  function addSymbol(name, type, node) {
    if (!name || !node?.loc) {
      return;
    }

    symbols.push({
      name,
      type,
      startLine: node.loc.start.line,
      endLine: node.loc.end.line
    });
  }

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }

    switch (node.type) {
      case "FunctionDeclaration":
        addSymbol(node.id?.name, "function", node);
        break;

      case "ClassDeclaration":
        addSymbol(node.id?.name, "class", node);
        break;

      case "VariableDeclarator":
        if (node.id?.type === "Identifier") {
          addSymbol(node.id.name, "variable", node);
        }
        break;

      case "ImportDeclaration":
        node.specifiers?.forEach((specifier) => {
          addSymbol(
            specifier.local?.name,
            "import",
            specifier
          );
        });
        break;

      case "ExportNamedDeclaration":
        if (node.declaration) {
          walk(node.declaration);
        }
        break;

      case "ExportDefaultDeclaration":
        if (node.declaration) {
          if (node.declaration.type === "FunctionDeclaration") {
            addSymbol(
              node.declaration.id?.name || "default",
              "export",
              node
            );
          } else if (node.declaration.type === "ClassDeclaration") {
            addSymbol(
              node.declaration.id?.name || "default",
              "export",
              node
            );
          }
        }
        break;
    }

    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "start" || key === "end") {
        continue;
      }

      const value = node[key];

      if (Array.isArray(value)) {
        value.forEach(walk);
      } else if (value && typeof value === "object") {
        walk(value);
      }
    }
  }

  walk(ast);

  return symbols;
}

module.exports = {
  extractSymbols
};
import fs from "node:fs";
import * as parser from "@babel/parser";

function extractRelationships(filePath, language) {
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

  const relationships = [];

  function addRelationship(type, from, to, extra = {}) {
    if (!from || !to || from === to) {
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

        if (source) {
          addRelationship(
            "imports",
            filePath,
            source
          );
        }

        break;
      }

      case "ExportNamedDeclaration": {
        if (node.source?.value) {
          addRelationship(
            "exports",
            filePath,
            node.source.value
          );
        }

        if (node.declaration) {
          const name = node.declaration.id?.name;

          if (name) {
            addRelationship(
              "exports",
              filePath,
              name
            );
          }
        }

        break;
      }

      case "ExportDefaultDeclaration":
        addRelationship(
          "exports",
          filePath,
          "default"
        );
        break;

      case "CallExpression": {
        if (
          activeFunction &&
          node.callee?.type === "Identifier"
        ) {
          addRelationship(
            "calls",
            activeFunction,
            node.callee.name
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
const path = require("path");

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".c",
  ".h",
  ".cpp",
  ".hpp",
  ".go",
  ".rs",
  ".php",
  ".html",
  ".css",
  ".scss"
]);

const CONFIG_EXTENSIONS = new Set([
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".xml"
]);

const DOCUMENTATION_EXTENSIONS = new Set([
  ".md",
  ".txt"
]);

function classifyFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const fileName = path.basename(normalizedPath).toLowerCase();
  const extension = path.extname(normalizedPath).toLowerCase();

  // Documentation
  if (
    DOCUMENTATION_EXTENSIONS.has(extension) ||
    fileName.startsWith("readme")
  ) {
    return "documentation";
  }

  // Configuration
  if (
    CONFIG_EXTENSIONS.has(extension) ||
    fileName === ".env.example" ||
    fileName === ".gitignore" ||
    fileName === "package-lock.json" ||
    fileName === "package.json"
  ) {
    return "configuration";
  }

  // Source code
  if (SOURCE_EXTENSIONS.has(extension)) {
    return "source";
  }

  return "other";
}

module.exports = {
  classifyFile
};
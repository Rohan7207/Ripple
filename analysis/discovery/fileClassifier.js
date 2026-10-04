import path from "node:path";

const SOURCE_EXTENSIONS = new Set([
  ".js", ".jsx", ".mjs", ".cjs",
  ".ts", ".tsx",
  ".py", ".java",
  ".c", ".h", ".cpp", ".hpp",
  ".go", ".rs", ".php",
  ".html", ".css", ".scss"
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

export function classifyFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const fileName = path.basename(normalizedPath).toLowerCase();
  const extension = path.extname(normalizedPath).toLowerCase();

  if (
    DOCUMENTATION_EXTENSIONS.has(extension) ||
    fileName.startsWith("readme")
  ) {
    return "documentation";
  }

  if (
    CONFIG_EXTENSIONS.has(extension) ||
    fileName === ".env.example" ||
    fileName === ".gitignore" ||
    fileName === "package-lock.json" ||
    fileName === "package.json"
  ) {
    return "configuration";
  }

  if (SOURCE_EXTENSIONS.has(extension)) {
    return "source";
  }

  return "other";
}
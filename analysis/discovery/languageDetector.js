const path = require("path");

const LANGUAGE_MAP = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",

  ".ts": "TypeScript",
  ".tsx": "TypeScript",

  ".py": "Python",
  ".java": "Java",

  ".c": "C",
  ".h": "C",
  ".cpp": "C++",
  ".hpp": "C++",

  ".go": "Go",
  ".rs": "Rust",
  ".php": "PHP",

  ".html": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",

  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML"
};

function detectLanguage(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return LANGUAGE_MAP[extension] || "Unknown";
}

module.exports = {
  detectLanguage
};
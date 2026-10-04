import fs from "node:fs";
import path from "node:path";

import { detectLanguage } from "./languageDetector.js";
import { classifyFile } from "./fileClassifier.js";

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  ".cache",
  "out"
]);

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function discoverFiles(repositoryPath) {
  const files = [];
  const directories = [];
  const warnings = [];

  function walk(currentPath, relativePath = "") {
    let entries;

    try {
      entries = fs.readdirSync(currentPath, {
        withFileTypes: true
      });
    } catch {
      warnings.push(
        `Unable to read directory: ${relativePath || "."}`
      );
      return;
    }

    for (const entry of entries) {
      const absolutePath = path.join(
        currentPath,
        entry.name
      );

      const entryRelativePath = path.join(
        relativePath,
        entry.name
      );

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        directories.push({
          path: entryRelativePath.replace(/\\/g, "/"),
          name: entry.name
        });

        walk(absolutePath, entryRelativePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      let stats;

      try {
        stats = fs.statSync(absolutePath);
      } catch {
        warnings.push(
          `Unable to inspect file: ${entryRelativePath}`
        );
        continue;
      }

      if (stats.size > MAX_FILE_SIZE) {
        warnings.push(
          `Skipped large file: ${entryRelativePath}`
        );
        continue;
      }

      const normalizedPath =
        entryRelativePath.replace(/\\/g, "/");

      files.push({
        path: normalizedPath,
        name: entry.name,
        absolutePath,
        size: stats.size,
        language: detectLanguage(normalizedPath),
        type: classifyFile(normalizedPath)
      });
    }
  }

  walk(repositoryPath);

  return {
    files,
    directories,
    warnings
  };
}
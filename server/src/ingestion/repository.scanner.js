import fs from "fs/promises";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
]);

export async function scanRepository(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      files.push({
        path: relativePath.replaceAll("\\", "/"),
        name: entry.name,
        extension: path.extname(entry.name),
        size: (await fs.stat(fullPath)).size,
      });
    }
  }

  await walk(rootDir);

  return {
    totalFiles: files.length,
    files,
  };
}

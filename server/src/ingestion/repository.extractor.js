import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";

export async function extractZip(buffer, repositoryId) {
  const rootDir = path.resolve("uploads", repositoryId);

  await fs.mkdir(rootDir, { recursive: true });

  const zip = new AdmZip(buffer);

  for (const entry of zip.getEntries()) {
    const entryPath = path.resolve(rootDir, entry.entryName);

    // Prevent Zip Slip
    if (!entryPath.startsWith(rootDir + path.sep)) {
      throw new Error("Unsafe ZIP entry detected");
    }

    if (entry.isDirectory) {
      await fs.mkdir(entryPath, { recursive: true });
      continue;
    }

    await fs.mkdir(path.dirname(entryPath), { recursive: true });
    await fs.writeFile(entryPath, entry.getData());
  }

  return rootDir;
}

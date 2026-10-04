import fs from "fs/promises";
import { createRepository } from "../stores/repository.store.js";
import { getRepository } from "../stores/repository.store.js";

import {
  generateRepositoryId,
  isValidGithubUrl,
} from "../utils/repository.utils.js";

import { extractZip } from "../ingestion/repository.extractor.js";

import { analyzeRepository } from "../../../analysis/analyzeRepository.js";

import { sanitizeSecrets } from "../../../analysis/security/secretSanitizer.js";

export async function createFromZip(file) {
  if (!file) {
    const error = new Error("Missing ZIP file (field: file)");
    error.statusCode = 400;
    error.code = "INVALID_REQUEST";
    throw error;
  }

  const repository = {
    id: generateRepositoryId(),
    name: file.originalname.replace(/\.zip$/i, ""),
    source: "zip",
    status: "PROCESSING",
    progress: 0,
    stage: "EXTRACTING",
    coverage: "FULL",
    warnings: [],
    createdAt: new Date().toISOString(),
  };

  createRepository(repository);

  // Start processing without blocking the API response.
  processZipRepository(repository, file.buffer);

  return repository;
}

async function processZipRepository(repository, buffer) {
  try {
    const rootDir = await extractZip(buffer, repository.id);

    const analysis = await analyzeRepository(rootDir, {
      onProgress: ({ progress, stage }) => {
        repository.progress = progress;
        repository.stage = stage;
      },
    });

    repository.rootDir = rootDir;
    repository.files = analysis.files;
    repository.totalFiles = analysis.statistics.files;
    repository.analysis = analysis;
    repository.coverage = analysis.analysis.coverage;
    repository.warnings = analysis.analysis.warnings;
    repository.progress = 100;
    repository.stage = "FINALIZING";
    repository.status = "READY";
  } catch (error) {
    console.error(`Repository analysis failed for ${repository.id}:`, error);

    repository.status = "FAILED";
    repository.stage = "FINALIZING";
    repository.warnings = [...(repository.warnings || []), error.message];
  }
}

export async function createFromGithub(url) {
  if (!isValidGithubUrl(url)) {
    const error = new Error("Invalid GitHub repository URL");
    error.statusCode = 400;
    error.code = "INVALID_REQUEST";
    throw error;
  }

  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");

  const repository = {
    id: generateRepositoryId(),
    name: url.replace(/\/+$/, "").split("/").pop(),
    source: "github",
    status: "PROCESSING",
    progress: 0,
    stage: "CLONING",
    coverage: "FULL",
    warnings: [],
    createdAt: new Date().toISOString(),
  };
  createRepository(repository);

  // Start GitHub processing without blocking the API response.
  processGithubRepository(repository, owner, repo);

  return repository;
}

async function processGithubRepository(repository, owner, repo) {
  try {
    const metadataResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Repository-Analyzer",
        },
      },
    );

    if (!metadataResponse.ok) {
      throw new Error("Unable to access GitHub repository");
    }

    const metadata = await metadataResponse.json();

    const zipResponse = await fetch(
      `https://github.com/${owner}/${repo}/archive/refs/heads/${encodeURIComponent(
        metadata.default_branch,
      )}.zip`,
    );

    if (!zipResponse.ok) {
      throw new Error("Unable to download GitHub repository");
    }

    const buffer = Buffer.from(await zipResponse.arrayBuffer());

    await processZipRepository(repository, buffer);
  } catch (error) {
    console.error(
      `GitHub repository processing failed for ${repository.id}:`,
      error,
    );

    repository.status = "FAILED";
    repository.stage = "FINALIZING";
    repository.warnings = [...(repository.warnings || []), error.message];
  }
}

export function getRepositoryById(repositoryId) {
  const repository = getRepository(repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    error.code = "REPOSITORY_NOT_FOUND";
    throw error;
  }

  return repository;
}

export function getRepositoryStatus(repositoryId) {
  const repository = getRepository(repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    error.code = "REPOSITORY_NOT_FOUND";
    throw error;
  }

  return {
    repositoryId: repository.id,
    status: repository.status,
    progress: repository.progress,
    stage: repository.stage,
    coverage: repository.coverage,
    warnings: repository.warnings,
  };
}

export function getRepositoryFiles(repositoryId) {
  const repository = getRepository(repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    error.code = "REPOSITORY_NOT_FOUND";
    throw error;
  }

  return {
    files: (repository.files || []).map((file) => ({
      id: Buffer.from(file.path).toString("base64url"),
      path: file.path,
      name: file.name,
      size: file.size,
      language: file.language,
      type: file.type,
    })),
    totalFiles: repository.totalFiles || 0,
  };
}

export async function getRepositoryFile(repositoryId, fileId) {
  const repository = getRepository(repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    error.code = "REPOSITORY_NOT_FOUND";
    throw error;
  }

  const filePath = Buffer.from(fileId, "base64url").toString("utf8");

  const file = (repository.files || []).find((file) => file.path === filePath);

  if (!file) {
    const error = new Error("File not found");
    error.statusCode = 404;
    error.code = "FILE_NOT_FOUND";
    throw error;
  }

  const rawContent = await fs.readFile(file.absolutePath, "utf8");
  const content = sanitizeSecrets(rawContent);

  const symbols = (repository.analysis?.symbols || []).filter(
    (symbol) => symbol.filePath === file.path,
  );

  return {
    id: fileId,
    path: file.path,
    language: file.language,
    type: file.type,
    content,
    symbols,
  };
}

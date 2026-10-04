import fs from "fs/promises";
import { createRepository } from "../stores/repository.store.js";
import { getRepository } from "../stores/repository.store.js";

import {
  generateRepositoryId,
  isValidGithubUrl,
} from "../utils/repository.utils.js";

import { extractZip } from "../ingestion/repository.extractor.js";

import { analyzeRepository } from "../../../analysis/analyzeRepository.js";

export async function createFromZip(file) {
  if (!file) {
    const error = new Error("Missing ZIP file (field: file)");
    error.statusCode = 400;
    error.code = "INVALID_REQUEST";
    throw error;
  }

  const repository = {
    id: generateRepositoryId(),
    source: "zip",
    status: "PROCESSING",
    createdAt: new Date().toISOString(),
  };

  createRepository(repository);

  try {
    const rootDir = await extractZip(file.buffer, repository.id);
    const analysis = await analyzeRepository(rootDir);

    repository.rootDir = rootDir;
    repository.files = analysis.files;
    repository.totalFiles = analysis.statistics.files;
    repository.analysis = analysis;
    repository.status = "READY";

    return repository;
  } catch (error) {
    repository.status = "FAILED";
    throw error;
  }
}

export function createFromGithub(url) {
  if (!isValidGithubUrl(url)) {
    const error = new Error("Invalid GitHub repository URL");
    error.statusCode = 400;
    error.code = "INVALID_REQUEST";
    throw error;
  }

  const repository = {
    id: generateRepositoryId(),
    source: "github",
    url,
    status: "PROCESSING",
    createdAt: new Date().toISOString(),
  };

  createRepository(repository);

  return repository;
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

  const content = await fs.readFile(file.absolutePath, "utf8");

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

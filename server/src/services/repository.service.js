import { createRepository } from "../stores/repository.store.js";
import { getRepository } from "../stores/repository.store.js";

import {
  generateRepositoryId,
  isValidGithubUrl,
} from "../utils/repository.utils.js";

import { extractZip } from "../ingestion/repository.extractor.js";
import { scanRepository } from "../ingestion/repository.scanner.js";

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
    const scan = await scanRepository(rootDir);

    repository.rootDir = rootDir;
    repository.files = scan.files;
    repository.totalFiles = scan.totalFiles;
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
    files: repository.files || [],
    totalFiles: repository.totalFiles || 0,
  };
}

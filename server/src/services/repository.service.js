import { createRepository } from "../stores/repository.store.js";

import {
  generateRepositoryId,
  isValidGithubUrl,
} from "../utils/repository.utils.js";

export function createFromZip(file) {
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

  return repository;
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

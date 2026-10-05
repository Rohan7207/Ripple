import fs from "fs/promises";

const repositories = new Map();

const REPOSITORY_TTL = 2 * 60 * 60 * 1000; // 2 hours

export function createRepository(repository) {
  repositories.set(repository.id, repository);

  setTimeout(async () => {
    const currentRepository = repositories.get(repository.id);

    if (!currentRepository) return;

    try {
      if (currentRepository.rootDir) {
        await fs.rm(currentRepository.rootDir, {
          recursive: true,
          force: true,
        });
      }
    } catch (error) {
      console.error(
        `Failed to clean repository ${repository.id}:`,
        error.message,
      );
    }

    repositories.delete(repository.id);
  }, REPOSITORY_TTL);

  return repository;
}

export function getRepository(repositoryId) {
  return repositories.get(repositoryId);
}

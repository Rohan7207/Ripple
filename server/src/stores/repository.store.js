const repositories = new Map();

export function createRepository(repository) {
  repositories.set(repository.id, repository);
  return repository;
}

export function getRepository(repositoryId) {
  return repositories.get(repositoryId);
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function createRepository({ file, githubUrl }) {
  let response;

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    response = await fetch(`${API_BASE_URL}/repositories`, {
      method: "POST",
      body: formData,
    });
  } else {
    response = await fetch(`${API_BASE_URL}/repositories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "github",
        url: githubUrl,
      }),
    });
  }

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to create repository");
  }

  return result.data;
}

export async function getRepositoryStatus(repositoryId) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/status`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to get repository status");
  }

  return result.data;
}

export async function getRepository(repositoryId) {
  const response = await fetch(`${API_BASE_URL}/repositories/${repositoryId}`);

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to get repository");
  }

  return result.data;
}

export async function getRepositoryFiles(repositoryId) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/files`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to get repository files");
  }

  return result.data;
}

export async function getRepositoryFile(repositoryId, fileId) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/files/${fileId}`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to get repository file");
  }

  return result.data;
}

export async function askRepository(repositoryId, question) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Failed to ask Ripple");
  }

  return result.data;
}

export async function analyzeRepositoryImpact(repositoryId, target) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/impact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || "Failed to analyze repository impact",
    );
  }

  return result.data;
}

export async function analyzeRepositoryWhatIf(repositoryId, scenario) {
  const response = await fetch(
    `${API_BASE_URL}/repositories/${repositoryId}/what-if`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scenario,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || "Failed to analyze what-if scenario",
    );
  }

  return result.data;
}

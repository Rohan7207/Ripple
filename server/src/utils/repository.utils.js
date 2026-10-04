import crypto from "crypto";

export function generateRepositoryId() {
  return `repo_${crypto.randomBytes(8).toString("hex")}`;
}

export function isValidGithubUrl(url) {
  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "github.com" &&
      parsed.pathname.split("/").filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

// utils/validate.js

export function validatePublish(metadata) {
  const { name, version, author, repo, description } = metadata;

  if (!name || !version || !author || !repo) {
    return { valid: false, error: "Missing required fields: name, version, author, repo" };
  }

  if (!repo.startsWith("https://github.com/")) {
    return { valid: false, error: "repo must be a GitHub URL" };
  }

  const repoMatch = repo.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/);
  if (!repoMatch) {
    return { valid: false, error: "Invalid GitHub repo URL format" };
  }

  if (!metadata.main && !metadata.bin) {
    return { valid: false, error: "zen.json must have 'main' or 'bin' entry" };
  }

  if (metadata.main && metadata.bin) {
    return { valid: false, error: "zen.json cannot have both 'main' and 'bin'" };
  }

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    return { valid: false, error: "version must be semver (1.0.0)" };
  }

  return { valid: true };
}

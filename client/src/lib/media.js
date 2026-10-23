const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const apiBaseUrl = (configuredApiUrl || "http://localhost:3001/").replace(/\/?$/, "/");

export function getMediaUrl(value) {
  if (!value) return null;
  const path = String(value).replace(/\\/g, "/");
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  const normalizedPath = path.replace(/^\/+/, "");
  // Uploads are served from the API root at /uploads, even if the API URL
  // includes a path prefix for JSON endpoints.
  if (normalizedPath.startsWith("uploads/")) {
    const apiOrigin = new URL(apiBaseUrl).origin;
    return `${apiOrigin}/${normalizedPath}`;
  }
  return new URL(normalizedPath, apiBaseUrl).toString();
}

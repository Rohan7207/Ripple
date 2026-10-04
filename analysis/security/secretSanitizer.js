const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(?:api[_-]?key|access[_-]?token|secret|password)\b\s*[:=]\s*["'`]([^"'`\r\n]+)["'`]/gi,
  /\b(?:sk-[a-zA-Z0-9_-]{20,}|gh[pousr]_[a-zA-Z0-9_]{20,}|AIza[a-zA-Z0-9_-]{20,})\b/g,
];

export function sanitizeSecrets(content) {
  if (typeof content !== "string") {
    return content;
  }

  let sanitized = content;

  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match, value) => {
      if (value !== undefined) {
        return match.replace(value, "[REDACTED]");
      }

      return "[REDACTED]";
    });
  }

  return sanitized;
}

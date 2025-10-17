const entityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export function sanitizeText(input: string): string {
  return input.replace(/[&<>"']/g, (char) => entityMap[char] ?? char);
}

export function sanitizeRichText(input: string | null | undefined): string {
  if (!input) {
    return "";
  }
  const trimmed = input.trim();
  return sanitizeText(trimmed);
}

const PREFIX = "bm";

export function createId(suffix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${PREFIX}-${suffix}-${crypto.randomUUID()}`;
  }
  return `${PREFIX}-${suffix}-${Math.random().toString(36).slice(2, 11)}`;
}

export function shortId(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(16).slice(2, 10);
}

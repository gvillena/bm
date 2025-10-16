const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const defaultLength = 8;

/**
 * Generates a short id suitable for ephemeral UI elements and directives.
 * The output avoids ambiguous characters to remain human-friendly.
 */
export function createId(prefix = "aria", length = defaultLength): string {
  const size = Math.max(4, Math.min(24, length));
  let token = "";
  for (let i = 0; i < size; i += 1) {
    const idx = Math.floor(Math.random() * alphabet.length);
    token += alphabet[idx];
  }
  return `${prefix}_${token}`;
}

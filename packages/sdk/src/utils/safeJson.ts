/**
 * JSON helpers that avoid silent failures and preserve big integers by using strings.
 */
export const safeJson = {
  /**
   * Safely parses JSON payloads throwing an explicit error when payload is empty or invalid.
   */
  parse<T>(input: string | ArrayBuffer | Uint8Array): T {
    try {
      const source =
        typeof input === "string"
          ? input
          : typeof ArrayBuffer !== "undefined" && input instanceof ArrayBuffer
            ? new TextDecoder().decode(input)
            : new TextDecoder().decode(input);
      if (!source || !source.trim()) {
        throw new Error("Empty JSON payload");
      }
      return JSON.parse(source, (_, value) => {
        if (typeof value === "string" && /^-?\d{16,}$/.test(value)) {
          return value;
        }
        return value;
      }) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON payload: ${error.message}`);
      }
      throw error;
    }
  },
  /**
   * Safely stringifies payloads, removing undefined values to avoid backend confusion.
   */
  stringify(input: unknown): string {
    return JSON.stringify(
      input,
      (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        if (value === undefined) {
          return undefined;
        }
        return value;
      },
      2,
    );
  },
};

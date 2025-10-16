import * as React from "react";

let globalCounter = 0;

export function uniqueId(prefix = "bm"): string {
  globalCounter += 1;
  return `${prefix}-${globalCounter.toString(36)}`;
}

/**
 * Hook que combina React.useId con un prefijo estable.
 * Útil para inputs/labels accesibles.
 */
export function useStableId(prefix = "bm"): string {
  const rid = React.useId();
  const [id] = React.useState(() => `${prefix}-${rid}`);
  return id;
}

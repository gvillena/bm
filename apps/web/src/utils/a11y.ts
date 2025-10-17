export function focusFirstInteractive(container: HTMLElement | null): void {
  if (!container) return;
  const focusable = container.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusable?.focus();
}

export function announce(message: string): void {
  if (typeof document === "undefined") return;
  let liveRegion = document.getElementById("bm-live-region");
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "bm-live-region";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
}

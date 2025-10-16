/**
 * Utilidades para atajos de teclado: "meta+k", "ctrl+shift+p", etc.
 * Normaliza OS: en Mac 'meta' = ⌘, en Win/Linux 'meta' suele mapear a Win.
 */

export type Modifier = "ctrl" | "shift" | "alt" | "meta";
export interface Hotkey {
  key: string; // e.g., "k", "p", "Enter"
  modifiers?: Modifier[]; // e.g., ["ctrl","shift"]
}

function normalizeKey(k: string) {
  // Ej.: "ArrowLeft" -> "arrowleft", "K" -> "k"
  return k.toLowerCase();
}

export function parseHotkey(combo: string): Hotkey {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((s) => s.trim());
  const mods: Modifier[] = [];
  let key = "";

  parts.forEach((p) => {
    if (p === "ctrl" || p === "control") mods.push("ctrl");
    else if (p === "shift") mods.push("shift");
    else if (p === "alt" || p === "option") mods.push("alt");
    else if (p === "meta" || p === "cmd" || p === "command") mods.push("meta");
    else key = p;
  });

  return { key, modifiers: mods };
}

export function isHotkey(e: KeyboardEvent, combo: string | Hotkey): boolean {
  const c = typeof combo === "string" ? parseHotkey(combo) : combo;
  const keyOk = normalizeKey(e.key) === normalizeKey(c.key);
  if (!keyOk) return false;

  const need = new Set(c.modifiers ?? []);
  const hasCtrl = e.ctrlKey;
  const hasShift = e.shiftKey;
  const hasAlt = e.altKey;
  const hasMeta = e.metaKey;

  if (need.has("ctrl") !== hasCtrl) return false;
  if (need.has("shift") !== hasShift) return false;
  if (need.has("alt") !== hasAlt) return false;
  if (need.has("meta") !== hasMeta) return false;

  // No se permiten modifiers extra no requeridos
  const totalNeeded = need.size;
  const totalPressed =
    Number(hasCtrl) + Number(hasShift) + Number(hasAlt) + Number(hasMeta);
  if (totalPressed !== totalNeeded) return false;

  return true;
}

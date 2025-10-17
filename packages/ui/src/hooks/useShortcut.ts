import { useEffect } from "react";

type ShortcutKey = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

export interface UseShortcutOptions {
  readonly preventDefault?: boolean;
  readonly target?: HTMLElement | Document;
}

function matchesShortcut(event: KeyboardEvent, shortcut: ShortcutKey) {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    (!!shortcut.ctrlKey === event.ctrlKey) &&
    (!!shortcut.altKey === event.altKey) &&
    (!!shortcut.shiftKey === event.shiftKey) &&
    (!!shortcut.metaKey === event.metaKey)
  );
}

export function useShortcut(
  shortcut: ShortcutKey,
  callback: (event: KeyboardEvent) => void,
  { preventDefault = true, target }: UseShortcutOptions = {}
) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!matchesShortcut(event, shortcut)) {
        return;
      }
      if (preventDefault) {
        event.preventDefault();
      }
      callback(event);
    };

    const listenTarget = target ?? document;
    listenTarget.addEventListener("keydown", listener);
    return () => listenTarget.removeEventListener("keydown", listener);
  }, [shortcut.key, shortcut.altKey, shortcut.ctrlKey, shortcut.metaKey, shortcut.shiftKey, callback, preventDefault, target]);
}

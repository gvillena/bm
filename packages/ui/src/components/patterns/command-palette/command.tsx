import * as React from "react";
import { isHotkey } from "@/utils/keybinds";
import { cn } from "@/lib/utils";

// Requiere tener añadido el componente `command` de shadcn:
// pnpm dlx shadcn@latest add command
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export type CommandPaletteItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string | string[];
  keywords?: string;
  group?: string;
  disabled?: boolean;
  onSelect?: () => void;
  href?: string; // si navegas manualmente
};

export interface CommandPaletteProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean) => void;
  hotkey?: string; // p.ej. "meta+k"
  placeholder?: string;
  items: CommandPaletteItem[];
  groupsOrder?: string[]; // orden opcional de grupos
  emptyText?: string;
  className?: string;
}

function normalizeShortcuts(sc?: string | string[]) {
  const list = Array.isArray(sc) ? sc : sc ? [sc] : [];
  return list.map((s) => s.toUpperCase());
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  hotkey = "meta+k",
  placeholder = "Buscar comandos…",
  items,
  groupsOrder,
  emptyText = "Sin resultados",
  className,
}) => {
  const isControlled = open !== undefined;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const opened = isControlled ? !!open : internal;

  const setOpened = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  };

  // Atajo global
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isHotkey(e, hotkey)) {
        e.preventDefault();
        setOpened(!opened);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [opened, hotkey]);

  // Agrupar
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    for (const it of items) {
      const g = it.group ?? "Comandos";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(it);
    }
    // Orden opcional
    if (groupsOrder?.length) {
      const ordered = new Map<string, CommandPaletteItem[]>();
      for (const g of groupsOrder) if (map.has(g)) ordered.set(g, map.get(g)!);
      for (const [g, arr] of map) if (!ordered.has(g)) ordered.set(g, arr);
      return ordered;
    }
    return map;
  }, [items, groupsOrder]);

  return (
    <CommandDialog
      open={opened}
      onOpenChange={setOpened}
      className={cn(className)}
    >
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        {[...groups.entries()].map(([group, arr], gi) => (
          <React.Fragment key={group}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {arr.map((it) => {
                const scs = normalizeShortcuts(it.shortcut);
                const onSelect = () => {
                  if (it.disabled) return;
                  if (it.onSelect) it.onSelect();
                  if (it.href) window.location.href = it.href;
                  setOpened(false);
                };
                return (
                  <CommandItem
                    key={it.id}
                    value={`${it.label} ${it.keywords ?? ""}`.trim()}
                    disabled={it.disabled}
                    onSelect={onSelect}
                  >
                    {it.icon && (
                      <span className="mr-2 text-text-2">{it.icon}</span>
                    )}
                    <span>{it.label}</span>
                    {scs.length > 0 && (
                      <div className="ml-auto flex items-center gap-1 text-xs text-text-2">
                        {scs.map((s) => (
                          <CommandShortcut key={s}>{s}</CommandShortcut>
                        ))}
                      </div>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

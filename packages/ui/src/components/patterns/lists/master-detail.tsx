import * as React from "react";
import { cn } from "@/lib/utils";
import { setupRovingTabindex } from "@/a11y/aria/aria-helpers";

export type MDItem = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  meta?: React.ReactNode; // por ejemplo, badge o texto corto
  disabled?: boolean;
};

export interface MasterDetailProps {
  items: MDItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
  renderDetail: (id: string | null) => React.ReactNode;
  emptyDetail?: React.ReactNode;
  className?: string;
  listClassName?: string;
  detailClassName?: string;
}

export const MasterDetail: React.FC<MasterDetailProps> = ({
  items,
  selectedId,
  defaultSelectedId,
  onSelect,
  renderDetail,
  emptyDetail = <div className="text-text-2">Selecciona un elemento</div>,
  className,
  listClassName,
  detailClassName,
}) => {
  const isControlled = selectedId !== undefined;
  const [internal, setInternal] = React.useState<string | null>(
    defaultSelectedId ?? null
  );
  const currentId = isControlled ? (selectedId ?? null) : internal;

  const listRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const select = (id: string) => {
    if (!isControlled) setInternal(id);
    onSelect?.(id);
  };

  // Roving tabindex para flechas
  React.useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const itemsEls = items
      .filter((it) => !it.disabled)
      .map((it) => itemRefs.current.get(it.id))
      .filter(Boolean) as HTMLButtonElement[];

    if (!itemsEls.length) return;

    const initialIndex = Math.max(
      0,
      items.findIndex((it) => it.id === currentId && !it.disabled)
    );
    const off = setupRovingTabindex(container, {
      items: itemsEls,
      initialIndex,
      loop: true,
      horizontal: false,
      onChangeIndex: (idx) => {
        const it = items.filter((i) => !i.disabled)[idx];
        if (it) select(it.id);
      },
    });
    return () => off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join("|")]);

  return (
    <div
      className={cn(
        // Layout responsive: columna en móvil, 2 columnas desde md
        "grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]",
        className
      )}
    >
      <div
        ref={listRef}
        role="listbox"
        aria-label="Lista"
        className={cn(
          "rounded-lg border border-(--color-surface-2) bg-surface-1 p-2",
          listClassName
        )}
      >
        {items.map((it) => {
          const selected = it.id === currentId;
          return (
            <button
              key={it.id}
              ref={(el) => {
                if (el) itemRefs.current.set(it.id, el);
                else itemRefs.current.delete(it.id);
              }}
              role="option"
              aria-selected={selected}
              disabled={it.disabled}
              onClick={() => select(it.id)}
              className={cn(
                "w-full text-left flex items-center gap-3 rounded-md px-2 py-2",
                "focus:outline-hidden focus:ring-3 focus:ring-primary-500",
                selected
                  ? "bg-primary-500/15 text-text-1"
                  : "hover:bg-surface-2 text-text-1",
                it.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {it.icon && <span className="text-text-2">{it.icon}</span>}
              <div className="min-w-0 flex-1">
                <div className="truncate">{it.label}</div>
                {it.description && (
                  <div className="truncate text-sm text-text-2">
                    {it.description}
                  </div>
                )}
              </div>
              {it.meta && <div className="text-xs text-text-2">{it.meta}</div>}
            </button>
          );
        })}
      </div>

      <div
        role="region"
        aria-label="Detalle"
        className={cn(
          "rounded-lg border border-(--color-surface-2) bg-surface-1 p-4",
          detailClassName
        )}
      >
        {currentId ? renderDetail(currentId) : emptyDetail}
      </div>
    </div>
  );
};

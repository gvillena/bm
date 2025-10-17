import { sanitizeRichText } from "../../utils/sanitize.js";

export interface SidebarSection {
  readonly id: string;
  readonly title: string;
  readonly items: { id: string; label: string; onSelect: () => void; active?: boolean }[];
}

export interface SidebarProps {
  readonly sections: SidebarSection[];
  readonly ariaLabel: string;
}

export function Sidebar({ sections, ariaLabel }: SidebarProps) {
  return (
    <nav aria-label={sanitizeRichText(ariaLabel)} className="flex flex-col gap-6 p-6">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <p className="text-xs font-semibold uppercase text-foreground/60">{section.title}</p>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    item.active ? "bg-accent/10 text-accent" : "hover:bg-foreground/5"
                  }`}
                  onClick={item.onSelect}
                >
                  {sanitizeRichText(item.label)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

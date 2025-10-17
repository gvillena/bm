import { Fragment } from "react";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface BreadcrumbsProps {
  readonly items: BreadcrumbItem[];
  readonly ariaLabel?: string;
}

export function Breadcrumbs({ items, ariaLabel = "Breadcrumb" }: BreadcrumbsProps) {
  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-2 text-sm text-foreground/70">
      <ol className="flex items-center gap-2" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.id}>
              <li>
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {sanitizeRichText(item.label)}
                  </a>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>{sanitizeRichText(item.label)}</span>
                )}
              </li>
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

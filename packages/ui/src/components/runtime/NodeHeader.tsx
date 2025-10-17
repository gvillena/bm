import type { SceneNode } from "@bm/runtime";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface NodeHeaderProps {
  readonly node: SceneNode;
}

export function NodeHeader({ node }: NodeHeaderProps) {
  const title =
    typeof node.meta?.title === "string"
      ? sanitizeRichText(node.meta.title)
      : node.id;
  const description =
    typeof node.meta?.description === "string"
      ? sanitizeRichText(node.meta.description)
      : undefined;
  return (
    <header className="space-y-1">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="text-sm text-foreground/70">{description}</p>
      ) : null}
    </header>
  );
}

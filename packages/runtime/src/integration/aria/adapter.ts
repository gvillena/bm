import type { SceneNode } from "../../graph/types.js";
import type { UiDirectives } from "./directives.js";

export interface AriaAdapter {
  readonly onNodeEnter?: (node: SceneNode, ctx: { viewerContext: unknown }) => UiDirectives | undefined;
  readonly onGuardDenied?: (reasons: string[]) => UiDirectives | undefined;
}

export class NoopAriaAdapter implements AriaAdapter {
  onNodeEnter(): UiDirectives | undefined {
    return undefined;
  }

  onGuardDenied(): UiDirectives | undefined {
    return { tone: "protective", hints: ["access-denied"] };
  }
}

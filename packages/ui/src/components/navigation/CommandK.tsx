import { useMemo, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import type { UiAction } from "@bm/aria";
import type { ExperienceEngine } from "@bm/runtime";
import { useMomentList } from "@bm/sdk";
import { useShortcut } from "../../hooks/useShortcut.js";
import { useMotionPreset, slideUp } from "../../theme/motion.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface CommandScene {
  readonly id: string;
  readonly title: string;
}

export interface CommandEditor {
  readonly id: string;
  readonly title: string;
}

export interface CommandIntent {
  readonly id: string;
  readonly label: string;
  readonly actionRef: UiAction["actionRef"];
}

export interface CommandKProps {
  readonly engine?: ExperienceEngine;
  readonly scenes?: CommandScene[];
  readonly editors?: CommandEditor[];
  readonly intents?: CommandIntent[];
  readonly labels?: {
    placeholder?: string;
    empty?: string;
    scenes?: string;
    runtime?: string;
    editors?: string;
    intents?: string;
    moments?: string;
    next?: string;
  };
  readonly onNavigateScene?: (sceneId: string) => void;
  readonly onOpenEditor?: (editorId: string) => void;
  readonly onIntent?: (intent: CommandIntent) => void;
}

export function CommandK({
  engine,
  scenes = [],
  editors = [],
  intents = [],
  labels,
  onNavigateScene,
  onOpenEditor,
  onIntent,
}: CommandKProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const motionPreset = useMotionPreset(slideUp);

  // 🧠 keyboard shortcuts
  useShortcut({ key: "k", metaKey: true }, () => setOpen((prev) => !prev));
  useShortcut({ key: "Escape" }, () => setOpen(false));

  // 🔍 query for Moments
  const momentQuery = useMomentList(
    search ? { q: search, pageSize: 5 } : undefined
  );

  const momentResults = useMemo(() => {
    if (!momentQuery.data?.items) return [];
    return momentQuery.data.items.map((moment) => ({
      id: moment.id,
      title: String(
        sanitizeRichText(String(moment.title ?? moment.id)) as string
      ),
    }));
  }, [momentQuery.data]);

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={(value: boolean) => setOpen(value)}
          label={String(labels?.placeholder ?? "Command palette")} // ✅ fixed TS2345
        >
          <Command.Overlay className="fixed inset-0 z-overlay bg-foreground/50" />

          <Command.Content asChild>
            <motion.div
              variants={motionPreset}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed left-1/2 top-24 z-modal w-full max-w-2xl -translate-x-1/2 rounded-lg border border-foreground/10 bg-background shadow-lg"
            >
              <Command.Input
                autoFocus
                value={search}
                onValueChange={(val: string) => setSearch(val)} // ✅ recognized by cmdk
                placeholder={String(
                  labels?.placeholder ?? "Type a command or search"
                )}
                aria-label="Search"
                className="w-full border-b border-foreground/10 bg-transparent px-4 py-3 text-base outline-none"
              />

              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-4 text-sm text-foreground/60">
                  {String(labels?.empty ?? "No matches found")}
                </Command.Empty>

                {scenes.length > 0 && (
                  <Command.Group heading={String(labels?.scenes ?? "Scenes")}>
                    {scenes.map((scene) => (
                      <Command.Item
                        key={scene.id}
                        value={`scene-${scene.id}`}
                        onSelect={() => {
                          setOpen(false);
                          onNavigateScene?.(scene.id);
                        }}
                      >
                        {String(scene.title)}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {engine && (
                  <Command.Group heading={String(labels?.runtime ?? "Runtime")}>
                    <Command.Item
                      value="runtime-next"
                      onSelect={() => {
                        setOpen(false);
                        void engine.next();
                      }}
                    >
                      {String(labels?.next ?? "Advance to next scene")}
                    </Command.Item>
                  </Command.Group>
                )}

                {editors.length > 0 && (
                  <Command.Group heading={String(labels?.editors ?? "Editors")}>
                    {editors.map((editor) => (
                      <Command.Item
                        key={editor.id}
                        value={`editor-${editor.id}`}
                        onSelect={() => {
                          setOpen(false);
                          onOpenEditor?.(editor.id);
                        }}
                      >
                        {String(editor.title)}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {intents.length > 0 && (
                  <Command.Group
                    heading={String(labels?.intents ?? "AI Intents")}
                  >
                    {intents.map((intent) => (
                      <Command.Item
                        key={intent.id}
                        value={`intent-${intent.id}`}
                        onSelect={() => {
                          setOpen(false);
                          onIntent?.(intent);
                        }}
                      >
                        {String(intent.label)}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {momentResults.length > 0 && (
                  <Command.Group heading={String(labels?.moments ?? "Moments")}>
                    {momentResults.map((moment) => (
                      <Command.Item
                        key={moment.id}
                        value={`moment-${moment.id}`}
                      >
                        {String(moment.title)}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </motion.div>
          </Command.Content>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}

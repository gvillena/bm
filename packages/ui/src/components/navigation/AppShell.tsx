export interface AppShellProps {
  readonly header?: React.ReactNode;
  readonly sidebar?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly children: React.ReactNode;
}

export function AppShell({ header, sidebar, footer, children }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-background text-foreground">
      {header ? <header className="border-b border-foreground/10" role="banner">{header}</header> : null}
      <div className="flex">
        {sidebar ? (
          <aside className="hidden w-72 border-r border-foreground/10 lg:block" role="complementary">
            {sidebar}
          </aside>
        ) : null}
        <main className="flex-1 px-6 py-8" role="main">
          {children}
        </main>
      </div>
      {footer ? <footer className="border-t border-foreground/10" role="contentinfo">{footer}</footer> : null}
    </div>
  );
}

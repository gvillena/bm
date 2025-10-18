import { Component, type ErrorInfo, type ReactNode, type ComponentType } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";

interface ErrorBoundaryProps {
  readonly children?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("runtime.error", error, info);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl space-y-4 rounded-lg border border-danger/30 bg-danger/10 p-8 text-sm">
          <h1 className="text-2xl font-semibold text-danger">Ocurrió un error</h1>
          <p className="text-foreground/70">{this.state.error?.message ?? "Algo salió mal."}</p>
          <RouterLinkCompat className="text-accent underline" to="/">
            Volver al inicio
          </RouterLinkCompat>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}

const RouterLinkCompat = RouterLink as ComponentType<LinkProps>;

declare module "react" {
  export type ReactNode = any;
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode | null;
  }
  export const createContext: <T>(defaultValue: T) => any;
  export const useContext: <T>(ctx: any) => T;
  export const useRef: <T>(value?: T) => { current: T };
  export const useState: <T>(initial: T) => [T, (value: T) => void];
  export const useMemo: <T>(factory: () => T, deps: unknown[]) => T;
  export const useCallback: <T extends (...args: any[]) => any>(fn: T, deps: unknown[]) => T;
  export const createElement: (...args: any[]) => ReactNode;
  export const useEffect: (fn: () => void | (() => void), deps?: unknown[]) => void;
  const React: { createElement: typeof createElement };
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

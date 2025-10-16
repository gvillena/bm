declare module "react" {
  export type ReactNode = any;
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode | null;
  }
  export interface Context<T> {
    Provider: FC<{ value: T }>;
    Consumer: FC<{ children: (value: T) => ReactNode }>;
  }
  export const createContext: <T>(defaultValue: T) => Context<T>;
  export const useContext: <T>(ctx: Context<T>) => T;
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

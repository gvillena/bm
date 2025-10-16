import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined | null;

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        try {
          (ref as React.MutableRefObject<T>).current = value;
        } catch {
          // ignore
        }
      }
    });
  };
}

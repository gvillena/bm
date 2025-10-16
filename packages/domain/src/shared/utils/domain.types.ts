export type Result<TValue> = Readonly<{ ok: true; value: TValue }> | Readonly<{ ok: false; error: Error }>;

export type GuardCheck = () => boolean;

export type NonEmptyArray<T> = [T, ...T[]];

export interface ViewerContext {
  viewerId: string;
  roles: string[];
  verificationLevel?: number;
  planTier?: string;
  reciprocityScore?: number;
  sharedMoments?: number;
}

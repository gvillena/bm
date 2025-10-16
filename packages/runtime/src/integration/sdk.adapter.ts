export interface SdkAdapter {
  readonly invoke: (
    name: string,
    payload: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ) => Promise<unknown>;
}

export class NoopSdkAdapter implements SdkAdapter {
  async invoke(): Promise<unknown> {
    return undefined;
  }
}

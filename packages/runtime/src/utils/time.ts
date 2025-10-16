export type Clock = () => number;

export const defaultClock: Clock = () => Date.now();

export const toIso = (timestamp: number): string => new Date(timestamp).toISOString();

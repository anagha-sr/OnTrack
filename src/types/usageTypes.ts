

type PerDayUsageTrack = Record<string, number>;
type UsageTrack =Record<string, PerDayUsageTrack>;
type ActiveSession = {
  tabId: number;
  domain: string;
  startedAt: number;
};

export type {  UsageTrack , ActiveSession};
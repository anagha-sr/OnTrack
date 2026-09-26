import { useEffect, useMemo, useState } from "react";
import useStorageValueReadOnly from "../hooks/useStorageReadOnly";
import type { UsageTrack } from "../types/usageTypes";

type Period = "today" | "week" | "month";

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
const refreshTracking = () => {
  chrome.runtime.sendMessage({ type: "UPDATE_TRACKING" });
};
function getStartDate(period: Period): Date {
  const date = new Date();

  if (period === "today") {
    date.setHours(0, 0, 0, 0);
  }

  if (period === "week") {
    date.setHours(0, 0, 0, 0);

    // Monday = first day of week
    const day = date.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;

    date.setDate(date.getDate() - daysFromMonday);
  }

  if (period === "month") {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }

  return date;
}

export default function TrackerPage() {
  const usageTrack = useStorageValueReadOnly<UsageTrack>("usage-track");
  const [period, setPeriod] = useState<Period>("today");

  useEffect(() => {
    refreshTracking();
  }, []);
  const usage = useMemo(() => {
    const startDate = getStartDate(period);
    const startTimestamp = startDate.getTime();

    const totals: Record<string, number> = {};

    for (const [dateString, domains] of Object.entries(usageTrack ?? {})) {
      const dateTimestamp = new Date(`${dateString}T00:00:00`).getTime();

      if (dateTimestamp < startTimestamp) continue;

      for (const [domain, duration] of Object.entries(domains)) {
        totals[domain] = (totals[domain] ?? 0) + duration;
      }
    }

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [usageTrack, period]);

  return (
    <div className="section">
      <h1 className="sr-only">Website Usage</h1>

      {/* Period selector */}
      <div className="sub-tabs">
        <button
          onClick={() => setPeriod("today")}
          className={`sub-tab ${period === "today" ? "active" : ""}`}
        >
          Today
        </button>

        <button
          onClick={() => setPeriod("week")}
          className={`sub-tab ${period === "week" ? "active" : ""}`}
        >
          This week
        </button>

        <button
          onClick={() => setPeriod("month")}
          className={`sub-tab ${period === "month" ? "active" : ""}`}
        >
          This month
        </button>
      </div>

      {/* Usage */}
      <div className="space-y-2">
        {usage.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">
            No usage recorded yet.
          </p>
        ) : (
          usage.map(([domain, duration]) => (
            <div
              key={domain}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <span className="truncate text-sm">{domain}</span>

              <span className="ml-4 shrink-0 text-sm font-medium">
                {formatDuration(duration)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

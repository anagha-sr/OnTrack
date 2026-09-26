import type { ActiveSession, UsageTrack } from "../types/usageTypes";

// helper functions
function getDomain(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function getLocalDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function startTracking(tabId: number, url: string) {
  console.error("startTracking", tabId, url, "at ", Date.now());

  const currentSession: ActiveSession = {
    tabId,
    domain: url,
    startedAt: Date.now(),
  };

  try {
    await chrome.storage.local
      .set({ "active-session": currentSession })
      .catch((e) => {
        console.error("Error setting active session:", e);
      });
    console.error(
      "active-session saved:",
      await chrome.storage.local.get("active-session"),
    );
  } catch (e) {
    console.error("Error setting active session:", e);
  }
}
async function stopTracking() {
  console.error("stopTracking at ", Date.now());

  const result = await chrome.storage.local.get("active-session");
  const activeSession: ActiveSession = result[
    "active-session"
  ] as ActiveSession;
  if (
    !activeSession ||
    !activeSession.tabId ||
    !activeSession.domain ||
    !activeSession.startedAt
  ) {
    console.error("No active session found");
    return;
  }

  const { domain, startedAt } = activeSession;
  const stoppedAt = Date.now();
  let current = startedAt;
  while (current < stoppedAt) {
    const currentDate = new Date(current);
    const nextMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    ).getTime();
    ////js handles this: new Date(2026, 8, 30 + 1)(30.09.2026 + 1 day) ->  new Date(2026, 9, 1) (01.10.2026)

    const end = Math.min(nextMidnight, stoppedAt);
    const elapsed = end - current;

    const date = getLocalDate(current);

    // Add `elapsed` to usage for `date`
    const result2 = await chrome.storage.local.get("usage-track");
    const usageTrack: UsageTrack = (result2["usage-track"] ?? {}) as UsageTrack;
    let updatedUsageTrack: UsageTrack;
    if(Object.hasOwn(usageTrack, date)) {
      if (Object.hasOwn(usageTrack?.[date], domain)) {
      updatedUsageTrack = {
        ...usageTrack,
        [date]: {
          ...usageTrack?.[date],
          [domain]: usageTrack?.[date]?.[domain] + elapsed,
        }
      };
    } else {
      updatedUsageTrack = {
        ...usageTrack,
        [date]: {
          ...usageTrack?.[date],
          [domain]: elapsed,
        }
      }
    }
  } else {
    updatedUsageTrack = {
      ...usageTrack,
      [date]: {
        [domain]: elapsed,
      }
    }

  }
    await chrome.storage.local.set({ "usage-track": updatedUsageTrack });
    await chrome.storage.local.remove("active-session");
    current = end;
  }
}
async function handleUpdateTracking() {
  const result = await chrome.storage.local.get("active-session");
  const activeSession: ActiveSession = result[
    "active-session"
  ] as ActiveSession;
  const storedTabId = activeSession?.tabId;
  const storedDomain = activeSession?.domain;

  const currentTab = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const currentTabId = currentTab[0]?.id;
  const currentDomain = getDomain(currentTab[0]?.url);

  if (storedTabId !== currentTabId || storedDomain !== currentDomain) {
    await stopTracking();
    if (currentTabId !== undefined && currentDomain) {
      await startTracking(currentTabId, currentDomain);
    }
  }
}

export { handleUpdateTracking };

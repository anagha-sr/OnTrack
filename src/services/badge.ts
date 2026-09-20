import type { SingleTimerState } from "../types/singleTimerTypes";
import type { LoopTimerState } from "../types/loopTimerTypes";
export async function setBadge() {
  await chrome.action.setBadgeText({ text: "!" });
  await chrome.action.setBadgeTextColor({ color: "#FFECBD" });
  await chrome.action.setBadgeBackgroundColor({ color: "#6FAF8F" })
}
export async function clearBadge() {
  const result1 = await chrome.storage.local.get("single-timer")
  const singleTimer = result1["single-timer"] as SingleTimerState;
  const result2 = await chrome.storage.local.get("loop-timer")
  const loopTimer = result2["loop-timer"] as LoopTimerState;
  if (singleTimer?.status === "completed" || loopTimer?.status === "waiting") {
    return
  }
  await chrome.action.setBadgeText({ text: "" });
}

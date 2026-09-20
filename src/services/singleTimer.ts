import type { SingleTimerMessage } from "../types/messagesTypes";
import type { SingleTimerState } from "../types/singleTimerTypes";
import {setBadge, clearBadge} from "./badge";
import { playSound, stopSound } from "./sound"
//All time units are in milliseconds.

export async function handleSingleTimerMessage(message: SingleTimerMessage) {
  switch (message.type) {
    case "START_SINGLE_TIMER": {
      const singleTimer: SingleTimerState = {
        status: "running",
        endTime: Date.now() + message.duration, // in milliseconds
      };
      await chrome.storage.local.set({"single-timer": singleTimer });
      await chrome.alarms.create("timer-end", {
        when: singleTimer.endTime,
      });
      break;
    }

    case "PAUSE_SINGLE_TIMER": {
      await chrome.alarms.clear("timer-end");
      const result = await chrome.storage.local.get("single-timer");
      const singleTimer = result["single-timer"] as SingleTimerState;
      if (singleTimer?.status !== "running") {
        throw new Error("Timer is not running");
      }
      const pausedTimer: SingleTimerState = {
        ...singleTimer,
        status: "paused",
        remaining: singleTimer.endTime - Date.now(),
      };

      await chrome.storage.local.set({ "single-timer": pausedTimer });
      break;
    }

    case "RESUME_SINGLE_TIMER": {
      const result = await chrome.storage.local.get("single-timer");
      const singleTimer = result["single-timer"] as SingleTimerState;
      if (singleTimer?.status !== "paused") {
        throw new Error("Timer is not paused");
      }

      const resumedTimer: SingleTimerState = {
        ...singleTimer,
        status: "running",
        endTime: Date.now() + singleTimer.remaining,
      };
      await chrome.storage.local.set({ "single-timer": resumedTimer });
      await chrome.alarms.create("timer-end", {
        when: resumedTimer.endTime,
      });
      break;
    }
    case "RESET_SINGLE_TIMER": {
      const singleTimer: SingleTimerState = {
        status: "idle",
      };
      await stopSound();
      await chrome.alarms.clear("timer-end");
      await chrome.storage.local.set({ "single-timer":singleTimer });
      await clearBadge();
      break;
    }
    default:
      break;
  }
}

export async function handleSingleTimerAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name !== "timer-end") return;
  const result = await chrome.storage.local.get("single-timer");
  const singleTimer = result["single-timer"] as SingleTimerState;
  if (singleTimer?.status !== "running") {
    return;
  }

  const completedSingleTimer: SingleTimerState = {
    status: "completed",
  }
  
  await chrome.storage.local.set({ "single-timer":completedSingleTimer});
  await setBadge();
  await chrome.notifications.create({
    type: "basic",
    title: "Timer",
    message: "Timer ended",
    iconUrl: "images/icon-16.png",
    
  },(notificationId) => {
    console.log("notificationId:", notificationId);
    console.log("error:", chrome.runtime.lastError);
  });
  await playSound();
}


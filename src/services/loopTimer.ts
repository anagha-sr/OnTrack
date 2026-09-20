import { type LoopTimerMessage } from "../types/messagesTypes";
import type { LoopTimerState } from "../types/loopTimerTypes";
import setBadge from "./setBadge";
import playSound from "./playSound";


export async function handleLoopTimerMessage(message: LoopTimerMessage) {
  switch (message.type) {
    case "START_LOOP_TIMER": {
      const loopTimer: LoopTimerState = {
        status: "running",
        phase: "work",
        phaseEndTime: Date.now() + message.workDuration,
        workDuration: message.workDuration,
        restDuration: message.restDuration,
      };
      await chrome.storage.local.set({ "loop-timer": loopTimer });
      await chrome.alarms.create("work-phase-end", {
        when: loopTimer.phaseEndTime,
      });
      break;
    }
    case "STOP_LOOP_TIMER": {
      const result = await chrome.storage.local.get("loop-timer");
      const oldLoopTimer = result["loop-timer"] as LoopTimerState;
      const newLoopTimer: LoopTimerState = {
        status: "idle",
        workDuration: oldLoopTimer.workDuration,
        restDuration: oldLoopTimer.restDuration,
      };

      await chrome.alarms.clear("work-phase-end");
      await chrome.alarms.clear("rest-phase-end");
      await chrome.storage.local.set({ "loop-timer": newLoopTimer });
      await chrome.action.setBadgeText({ text: "" });
      break;
    }
    case "PHASE_CHANGE_LOOP_TIMER": {
      const result = await chrome.storage.local.get("loop-timer");
      let loopTimer = result["loop-timer"] as LoopTimerState;
      if (loopTimer?.status !== "waiting") {
        throw new Error("Timer is not waiting");
      }
      let newPhaseEndTime = 0;
      if (loopTimer.phase == "work") {
        newPhaseEndTime = Date.now() + loopTimer.restDuration;
        await chrome.storage.local.set({
          "loop-timer": {
            ...loopTimer,
            phaseEndTime: newPhaseEndTime,
            phase: "rest",
            status: "running",
          },
        });
        await chrome.alarms.clear("work-phase-end");
        await chrome.alarms.clear("rest-phase-end");
        await chrome.alarms.create("work-phase-end", {
          when: newPhaseEndTime,
        });
      } else {
        //loopTimer.phase=='rest'
        newPhaseEndTime = Date.now() + loopTimer.workDuration;
        await chrome.storage.local.set({
          "loop-timer": {
            ...loopTimer,
            phaseEndTime: newPhaseEndTime,
            phase: "work",
            status: "running",
          },
        });
        await chrome.alarms.clear("work-phase-end");
        await chrome.alarms.clear("rest-phase-end");
        await chrome.alarms.create("rest-phase-end", {
          when: newPhaseEndTime,
        });
      }
      break;
    }

    case "PAUSE_LOOP_TIMER": {
      const result = await chrome.storage.local.get("loop-timer");
      const loopTimer = result["loop-timer"] as LoopTimerState;
      if (loopTimer?.status !== "running") {
        throw new Error("Timer is not running");
      }
      const pausedTimer: LoopTimerState = {
        ...loopTimer,
        status: "paused",
        phaseRemaining: loopTimer.phaseEndTime - Date.now(),
      };
      await chrome.alarms.clear("work-phase-end");
      await chrome.alarms.clear("rest-phase-end");
      await chrome.storage.local.set({ "loop-timer": pausedTimer });

      break;
    }
    case "RESUME_LOOP_TIMER":
      const result = await chrome.storage.local.get("loop-timer");
      const loopTimer = result["loop-timer"] as LoopTimerState;
      if (loopTimer?.status !== "paused") {
        throw new Error("Timer is not paused");
      }
      const resumedTimer: LoopTimerState = {
        ...loopTimer,
        status: "running",
        phaseEndTime: Date.now() + loopTimer.phaseRemaining,
      };
      if (loopTimer.phase == "work") {
        await chrome.alarms.create("work-phase-end", {
          when: resumedTimer.phaseEndTime,
        });
      } else {
        //loopTimer.phase=='rest'
        await chrome.alarms.create("rest-phase-end", {
          when: resumedTimer.phaseEndTime,
        });
      }
      await chrome.storage.local.set({ "loop-timer": resumedTimer });
      break;
  }
}

export async function handleLoopTimerAlarm(alarm: chrome.alarms.Alarm) {
  if ((alarm.name !== "work-phase-end")&&(alarm.name !== "rest-phase-end")) return;
  const result = await chrome.storage.local.get("loop-timer");
  const loopTimer = result["loop-timer"] as LoopTimerState;
  if (loopTimer?.status !== "running") {
    return;
  }
  const waitingLoopTimer: LoopTimerState = {
    ...loopTimer,
    status: "waiting",
  }
  await chrome.storage.local.set({ "loop-timer": waitingLoopTimer });
  await setBadge();
  await chrome.notifications.create({
    type: "basic",
    title: "Timer",
    message: "Timer ended",
    iconUrl: "images/icon-16.png",
  });
  await playSound();
}

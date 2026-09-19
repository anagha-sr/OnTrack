import type { SingleTimerMessage } from "../types/messagesTypes";
import type { LoopTimerMessage } from "../types/messagesTypes";
import { handleSingleTimerMessage } from "../services/singleTimer";
import { handleSingleTimerAlarm } from "../services/singleTimer";
import { handleLoopTimerMessage } from "../services/loopTimer";
import { handleLoopTimerAlarm } from "../services/loopTimer";

chrome.alarms.onAlarm.addListener(handleSingleTimerAlarm);
chrome.alarms.onAlarm.addListener(handleLoopTimerAlarm);

chrome.runtime.onMessage.addListener(async (message: SingleTimerMessage|LoopTimerMessage) => {
  switch (message.type) {
    case "START_SINGLE_TIMER":
    case "PAUSE_SINGLE_TIMER":
    case "RESUME_SINGLE_TIMER":
    case "RESET_SINGLE_TIMER":
      return await handleSingleTimerMessage(message);
    case "START_LOOP_TIMER":
    case "STOP_LOOP_TIMER":
    case "PHASE_CHANGE_LOOP_TIMER":
    case "PAUSE_LOOP_TIMER":
    case "RESUME_LOOP_TIMER":
      return await handleLoopTimerMessage(message);
    default:
      return;
  }
});

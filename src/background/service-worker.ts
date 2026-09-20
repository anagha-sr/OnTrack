import type { SingleTimerMessage } from "../types/messagesTypes";
import type { LoopTimerMessage } from "../types/messagesTypes";
import type { TaskMessage } from "../types/messagesTypes";
import { handleSingleTimerMessage } from "../services/singleTimer";
import { handleSingleTimerAlarm } from "../services/singleTimer";
import { handleLoopTimerMessage } from "../services/loopTimer";
import { handleLoopTimerAlarm } from "../services/loopTimer";
import { handleTasksMessage } from "../services/tasks";

chrome.alarms.onAlarm.addListener(handleSingleTimerAlarm);
chrome.alarms.onAlarm.addListener(handleLoopTimerAlarm);

chrome.runtime.onMessage.addListener(async (message: SingleTimerMessage|LoopTimerMessage|TaskMessage) => {
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
    case "INITIALIZE_TASK_STATE":
    case "ADD_TASK":
    case "DELETE_TASK":
    case "DELETE_TASK_TAB":
    case "RENAME_TASK_TAB":
    case "TOGGLE_TASK":
    case "ADD_TASK_TAB":
      return await handleTasksMessage(message);
    default:
      return;
  }
});

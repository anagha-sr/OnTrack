import type {
  SingleTimerMessage,
  LoopTimerMessage,
  TaskMessage,
  TrackingMessage,
  JotsMessage,
} from "../types/messagesTypes";

import {
  handleSingleTimerMessage,
  handleSingleTimerAlarm,
} from "../services/singleTimer";
import {
  handleLoopTimerMessage,
  handleLoopTimerAlarm,
} from "../services/loopTimer";

import { handleTasksMessage } from "../services/tasks";
import { handleUpdateTracking } from "../services/usageTracking";
import { handleJotsMessage } from "../services/jots";

// Set up usage tracking
chrome.tabs.onActivated.addListener(handleUpdateTracking);
chrome.tabs.onUpdated.addListener(handleUpdateTracking);
chrome.tabs.onCreated.addListener(handleUpdateTracking);
chrome.tabs.onRemoved.addListener(handleUpdateTracking);

chrome.windows.onCreated.addListener(handleUpdateTracking);
chrome.windows.onRemoved.addListener(handleUpdateTracking);
chrome.windows.onFocusChanged.addListener(handleUpdateTracking);
// Set up alarms
chrome.alarms.onAlarm.addListener(handleSingleTimerAlarm);
chrome.alarms.onAlarm.addListener(handleLoopTimerAlarm);

// Set context menu
chrome.contextMenus.create({
  id: "add-to-jots",
  title: "Add to Jots",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "add-to-jots") return;
    console.error("context menu clicked", JSON.stringify(info));

  const text = info.selectionText?.trim().slice(0, 5000);
  if (!text) return;

  await handleJotsMessage({ type: "ADD_JOTS", content: text }).catch(console.error);
});

chrome.runtime.onMessage.addListener(
  async (
    message:
      | SingleTimerMessage
      | LoopTimerMessage
      | TaskMessage
      | TrackingMessage
      | JotsMessage,
  ) => {
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
      case "UPDATE_TRACKING":
        return await handleUpdateTracking();
      case "UPDATE_JOTS":
      case "ADD_JOTS":
      case "DELETE_JOTS":
        return await handleJotsMessage(message);
      default:
        return;
    }
  },
);

import type { TaskMessage } from "../types/messagesTypes";
import type { Tab, Task, TaskState } from "../types/taskTypes";

const defaultTaskState: TaskState = {
    [crypto.randomUUID()]: { tabName: "Work", tasks: [] },
    [crypto.randomUUID()]: { tabName: "Personal", tasks: [] },
};

export async function handleTasksMessage(message: TaskMessage) {
  const result = await chrome.storage.local.get("taskstate")
  const oldTaskState = result["taskstate"] as TaskState;
  switch (message.type) {
    case "INITIALIZE_TASK_STATE": {
        const result = await chrome.storage.local.get("taskstate")
        const oldTaskState = result["taskstate"] as TaskState;
        if (oldTaskState) {
          return;
        }   
      const newTaskState: TaskState = {
        ...defaultTaskState,
      }
      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "ADD_TASK": {
      const description: string = message.description;
      const tabId: string = message.tabId;
      const task: Task = {
        taskId: crypto.randomUUID(),
        description: description,
        completed: false,
      };
      const newTaskState: TaskState = {
        ...oldTaskState,
        [tabId]: {
          ...oldTaskState[tabId],
          tasks: [...oldTaskState[tabId].tasks, task],
        },
      };
      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "DELETE_TASK": {
      const taskId: string = message.taskId;
      const tabId: string = message.tabId;
      const selectedTab: Tab = oldTaskState[tabId];
      const taskIndexToDelete: number = selectedTab.tasks.findIndex(
        (task) => task.taskId === taskId,
      );
      if (taskIndexToDelete === -1) return;
      const updatedTab: Tab = {
        ...selectedTab,
        tasks: [
          ...selectedTab.tasks.slice(0, taskIndexToDelete),
          ...selectedTab.tasks.slice(taskIndexToDelete + 1),
        ],
      };
      const newTaskState: TaskState = {
        ...oldTaskState,
        [tabId]: updatedTab,
      };
      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "DELETE_TASK_TAB": {
      const tabId: string = message.tabId;
      if (Object.keys(oldTaskState).length === 1) return;
      const { [tabId]: _, ...newTaskState } = oldTaskState;
      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "RENAME_TASK_TAB": {
      const tabId: string = message.tabId;
      const newTabName: string = message.newTabName;
      const tabName = oldTaskState[tabId].tabName;
      if (tabName === newTabName) return;
      let finalTabName = newTabName;
      let num: number = 1;
      while (
        Object.keys(oldTaskState).find(
          (key) => oldTaskState[key].tabName === finalTabName,
        )
      ) {
        finalTabName = newTabName + `-${num}`;
        num++;
      }

      const newTaskState: TaskState = {
        ...oldTaskState,
        [tabId]: {
          ...oldTaskState[tabId],
          tabName: finalTabName,
        },
      };

      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "ADD_TASK_TAB": {
      const tabId = crypto.randomUUID();
      const newTabName: string = message.tabName;
      let finalTabName = newTabName;
      let num: number = 1;
      while (
        Object.keys(oldTaskState).find(
          (key) => oldTaskState[key].tabName === finalTabName,
        )
      ) {
        finalTabName = newTabName + `-${num}`;
        num++;
      }
      const newTaskState: TaskState = {
        ...oldTaskState,
        [tabId]: {
          tabName: finalTabName,
          tasks: [],
        },
      };

      await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    case "TOGGLE_TASK": {
      const taskId: string = message.taskId;
      const tabId: string = message.tabId;
      const newTaskState: TaskState = {
          ...oldTaskState,
          [tabId]: {
              ...oldTaskState[tabId],
              tasks: oldTaskState[tabId].tasks.map((task) => {
                  if (task.taskId === taskId) {
                      return {
                          ...task,
                          completed: !task.completed,
                      };
                  }
                  return task;
              }),
          }
      }
              await chrome.storage.local.set({ taskstate: newTaskState });
      break;
    }
    default:
      console.error("Unknown message type");
      break;
  }
}

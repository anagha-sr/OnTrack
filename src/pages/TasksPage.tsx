import { useState, useEffect } from "react";
// import useStorageValue from "../hooks/useStorageValue";
import type { TaskState } from "../types/taskTypes";
import useStorageValueReadOnly from "../hooks/useStorageReadOnly";

function TasksPage() {
  const taskState = useStorageValueReadOnly<TaskState>("taskstate");
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [renamingTab, setRenamingTab] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [isAddTabOpen, setIsAddTabOpen] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  useEffect(() => {
    chrome.runtime.sendMessage({
      type: "INITIALIZE_TASK_STATE",
    });
  }, []);

  useEffect(() => {
    if (!taskState) {
      return;
    }
    const firstTab = Object.keys(taskState)[0];

    if (firstTab && !currentTab) {
      setCurrentTab(firstTab);
    }
  }, [taskState, currentTab]);

  const handleAddTab = async (tabName: string) => {
    if (!tabName) {
      setIsAddTabOpen(false);
      return;
    }
    try {
      await chrome.runtime.sendMessage({
        type: "ADD_TASK_TAB",
        tabName: tabName,
      });
    } catch (e) {
      console.error("Add tab error:", e);
    }
    setNewTabName("");
    setIsAddTabOpen(false);
  };

  const handleRenameTab = async (tabId: string) => {
    if (!newTabName) {
      setRenamingTab(null);
      return;
    }
    try {
      await chrome.runtime.sendMessage({
        type: "RENAME_TASK_TAB",
        tabId: tabId,
        newTabName,
      });
    } catch (e) {
      console.error("Rename tab error:", e);
    }
    setNewTabName("");
    setRenamingTab(null);
  };
  const handleDeleteTab = async (tabId: string) => {
    if (
      confirm(
        `Are you sure you want to delete the category ${taskState?.[tabId]?.tabName}? You will lose all tasks in this category.`,
      )
    ) {
      try {
        await chrome.runtime.sendMessage({
          type: "DELETE_TASK_TAB",
          tabId: tabId,
        });
      } catch (e) {
        console.error("Delete tab error:", e);
      }

      taskState && setCurrentTab(Object.keys(taskState)[0]);
    } else {
      return;
    }
  };
  const handleAddTask = async () => {
    if (!newTaskDescription) {
      setIsAddTaskOpen(false);
      return;
    }
    try {
      await chrome.runtime.sendMessage({
        type: "ADD_TASK",
        description: newTaskDescription,
        tabId: currentTab,
      });
    } catch (e) {
      console.error("Add task error:", e);
    }
    setNewTaskDescription("");
    setIsAddTaskOpen(false);
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      await chrome.runtime.sendMessage({
        type: "DELETE_TASK",
        taskId: taskId,
        tabId: currentTab,
      });
    } catch (e) {
      console.error("Delete task error:", e);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    try {
      chrome.runtime.sendMessage({
        type: "TOGGLE_TASK",
        taskId: taskId,
        tabId: currentTab,
      });
    } catch (e) {
      console.error("Toggle task error:", e);
    }
  };
  const handleRenameTabOpen = (tabId: string) => {
    setRenamingTab(tabId);
    setNewTabName(taskState?.[tabId]?.tabName || "");
  };

  return (
    <section>
      <h2 className="sr-only">Tasks</h2>
      <nav className="sub-tabs">
        {taskState &&
          Object.keys(taskState).map((tabId) => (
            <button
              key={tabId}
              onClick={() => setCurrentTab(tabId)}
              className={`sub-tab ${tabId === currentTab ? "active" : ""}`}
              aria-selected={tabId === currentTab}
              onDoubleClick={() => handleRenameTabOpen(tabId)}
            >
              {(renamingTab === tabId && (
                <input
                  type="text"
                  className=" flex-0"
                  value={newTabName}
                  onChange={(event) => setNewTabName(event.target.value)}
                  onBlur={() => handleRenameTab(tabId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleRenameTab(tabId);
                    }
                  }}
                  autoFocus
                />
              )) ||
                taskState[tabId].tabName}
            </button>
          ))}

        <button
          onClick={() => setIsAddTabOpen(true)}
          className={`sub-tab ${isAddTabOpen ? "active" : ""}`}
          aria-label={isAddTabOpen ? "New tab name." : "Open add tab form."}
          title={isAddTabOpen ? "New tab name." : "Open add tab form."}
        >
          {isAddTabOpen ? (
            <input
              className="flex-1"
              type="text"
              value={newTabName}
              onChange={(event) => setNewTabName(event.target.value)}
              onBlur={() => handleAddTab(newTabName)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddTab(newTabName);
                }
              }}
              autoFocus
            />
          ) : (
            "+"
          )}
        </button>
      </nav>
      <h2 className="sr-only">{currentTab}</h2>

      <div className="task-list">
        <div className="flex flex-col gap-1">
          {currentTab && taskState?.[currentTab]?.tasks?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-center pt-4 text-lg">
                No tasks in this category
                <br />
                Add a task to get started
              </p>
            </div>
          )}
          {/* add task */}
          <div className="mt-4  flex items-center justify-center gap-2">
            <div className="tooltip-wrapper">
              <button
                aria-label={
                  isAddTaskOpen ? "Close add task form." : "Open add task form."
                }
                onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
                className="btn btn-round btn-outline "
              >
                {isAddTaskOpen ? (
                    <span className="material-symbols-outlined">close</span>
                ) : (
                    <span className="material-symbols-outlined">add</span>
                )}
              </button>
                            {isAddTaskOpen ? <span className="tooltip">Cancel</span> : <span className="tooltip">Add task</span>}
            </div>
            {isAddTaskOpen && (
              <div className="flex flex-1 gap-2">
                <input
                  className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-gray-400 focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--focus)]"
                  type="text"
                  placeholder="Task description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  aria-hidden={!isAddTaskOpen}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddTask();
                    }
                  }}
                />
                <button
                  aria-label="Add task."
                  disabled={!newTaskDescription}
                  onClick={() => handleAddTask()}
                  className="btn btn-secondary "
                >
                  Add
                </button>
              </div>
            )}
          </div>
          {/* all tasks  completed*/}
          {currentTab &&
            taskState?.[currentTab]?.tasks?.length !== 0 &&
            taskState?.[currentTab]?.tasks?.filter((task) => !task.completed)
              .length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-center pt-4 text-lg">
                  All tasks completed! ✨
                </p>
              </div>
            )}
          {/* incomplete tasks */}
          <ul className="flex flex-col gap-2 mt-3">
            {currentTab &&
              taskState?.[currentTab]?.tasks
                ?.filter((task) => !task.completed)
                .reverse()
                .map((task) => (
        
                    <li
                      key={task.taskId}
                      className="flex items-center gap-1"
                    >
                       <label
                    htmlFor={task.taskId}
                    key={task.taskId}
                    aria-label={task.description}
                    className="task-label"
                  >
                      <input
                        id={task.taskId}
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task.taskId)}
                        className="task-checkbox"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-[var(--text)]"
                        }`}
                      >
                        {task.description}
                      </span>
                      </label>
                      <div className="tooltip-wrapper">
                        <button
                          aria-label="Delete task."
                          onClick={() => handleDeleteTask(task.taskId)}
                          className="material-symbols-outlined btn btn-text"
                        >
                          delete
                        </button>
                        <span className="tooltip">Delete this task</span>
                      </div>
                    </li>
        
                ))}
          </ul>
        </div>
        <hr className="my-4 border-[var(--border)]" />
        {/* completed tasks */}
        <div className="flex flex-col gap-3">
                  <ul className="flex flex-col gap-2 mt-3">
            {currentTab &&
              taskState?.[currentTab]?.tasks
                ?.filter((task) => task.completed)
                .reverse()
                .map((task) => (
        
                    <li
                      key={task.taskId}
                      className="flex items-center gap-1"
                    >
                       <label
                    htmlFor={task.taskId}
                    key={task.taskId}
                    aria-label={task.description}
                    className="task-label"
                  >
                      <input
                        id={task.taskId}
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task.taskId)}
                        className="task-checkbox"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-[var(--text)]"
                        }`}
                      >
                        {task.description}
                      </span>
                      </label>
                      <div className="tooltip-wrapper">
                        <button
                          aria-label="Delete task."
                          onClick={() => handleDeleteTask(task.taskId)}
                          className="material-symbols-outlined btn btn-text"
                        >
                          delete
                        </button>
                        <span className="tooltip">Delete this task</span>
                      </div>
                    </li>
        
                ))}
          </ul>
        </div>
      </div>
      {currentTab && (
        <div className="mt-4 flex justify-end">
          {/* <button onClick={() => alert("currentTab:" + currentTab)}>
            test currentTab
          </button> */}
          <div className="tooltip-wrapper">
            <button
              onClick={() => handleDeleteTab(currentTab)}
              className="btn btn-round btn-outline "
              aria-label="Delete this category."
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
            <span className="tooltip">Delete this category.</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default TasksPage;

import { useState } from "react";
import useStorageValue from "../hooks/useStorageValue";
import type { TaskState } from "../types/taskTypes";

const defaultTaskState: TaskState = {
    [crypto.randomUUID()]:{tabName: "Work",
    tasks: []},
    [crypto.randomUUID()]:{tabName: "Personal",
    tasks: []},
  }

function TasksPage() {
  const taskState = useStorageValue<TaskState>("taskstate",defaultTaskState);
  const [currentTab, setCurrentTab] = useState<string>(
    Object.keys(taskState)[0],
  );
  const [renamingTab, setRenamingTab] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [isAddTabOpen, setIsAddTabOpen] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");

  const handleAddTab = async (tabName: string) => {
   try{ await chrome.runtime.sendMessage({
      type: "ADD_TASK_TAB",
      tabName: tabName
    })}catch(e){console.error("Add tab error:",e)}
    setIsAddTabOpen(false);
  };

  const handleRenameTab =async (tabId: string) => {
    try{await chrome.runtime.sendMessage({
      type: "RENAME_TASK_TAB",
      tabId: tabId,
      newTabName
    })}catch(e){console.error("Rename tab error:",e)}
    setNewTabName("");
    setRenamingTab(null);
  };
  const handleDeleteTab = (tabId: string) => {
    try{chrome.runtime.sendMessage({
      type: "DELETE_TASK_TAB",
      tabId: tabId
    })}catch(e){console.error("Delete tab error:",e)}
  };
  const handleAddTask = () => {
    try{chrome.runtime.sendMessage({
      type: "ADD_TASK",
      description: newTaskDescription,
      tabId: currentTab
    })}catch(e){console.error("Add task error:",e)}
    setNewTaskDescription("");
    setIsAddTaskOpen(false)
  };

  const handleTaskToggle = (taskId: string) => {
    try{chrome.runtime.sendMessage({
      type: "TOGGLE_TASK",
      taskId: taskId,
      tabId: currentTab
    })}catch(e){console.error("Toggle task error:",e)}
  
  };

  return (
    <section>
      <h2 className="sr-only">Tasks</h2>
      <nav className="sub-tabs">
        {Object.keys(taskState).map((tabId) => (
          <button
            key={tabId}
            onClick={() => setCurrentTab(tabId)}
            className={`sub-tab ${tabId === currentTab ? "active" : ""}`}
            aria-selected={tabId === currentTab}
            onDoubleClick={() => setRenamingTab(tabId)}
          >
            {(renamingTab === tabId && (
              <input
                type="text"
                value={newTabName}
                onChange={(event) => setNewTabName(event.target.value)}
                onBlur={() => handleRenameTab(tabId)}
              />
            )) ||
              taskState[tabId].tabName}
          </button>
        ))}

        <button
          onClick={() => setIsAddTabOpen(true)}
          className="sub-tab"
          aria-label={isAddTabOpen ? "New tab name." : "Open add tab form."}
        >
          {isAddTabOpen ? (
            <input
              className="flex-1"
              type="text"
              value={newTabName}
              onChange={(event) => setNewTabName(event.target.value)}
              onBlur={() => handleAddTab(newTabName)}
            />
          ) : (
            "+"
          )}
        </button>
      </nav>
      <div>
        <h2 className="sr-only">{currentTab}</h2>
        <ul>
          {taskState[currentTab].tasks.map((task) => (
            <li key={task.taskId}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  handleTaskToggle(task.taskId)
                }
              />
              {task.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <button
          aria-label={
            isAddTaskOpen ? "Close add task form." : "Open add task form."
          }
          onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
        >
          {isAddTaskOpen ? "X" : "+"}
        </button>
        {isAddTaskOpen && (
          <div className={`add-task-form felx gap-2`}>
            <input
              className="flex-1"
              type="text"
              placeholder="Task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              aria-hidden={!isAddTaskOpen}
            />
            <button aria-label="Add task." onClick={() => handleAddTask()}>
              Add
            </button>
          </div>
        )}
        <div className="flex justify-end">
          <button onClick={() => handleDeleteTab(currentTab)}>
            Delete this tab
          </button>
        </div>
      </div>
    </section>
  );
}

export default TasksPage;

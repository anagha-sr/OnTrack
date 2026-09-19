import { useState, useEffect } from "react";

const defaultTasksTabs = ["work", "personal"];

type Task = {
    id: string;
  description: string;
  completed: boolean;
};
type Tasks = {
  [key: string]: Task[];
};

function Tasks() {
  const [taskTabs, setTaskTabs] = useState(defaultTasksTabs);
  const [tasks, setTasks] = useState<Tasks>(
    defaultTasksTabs.reduce((acc, tab) => ({ ...acc, [tab]: [] }), {}),
  );
  const [currentTab, setCurrentTab] = useState<string>(taskTabs[0]);


  useEffect(() => {
    let savedTaskTabs = localStorage.getItem("taskTabs");
    if (savedTaskTabs) {
      setTaskTabs(JSON.parse(savedTaskTabs));
    } else {
      localStorage.setItem("taskTabs", JSON.stringify(defaultTasksTabs));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("taskTabs", JSON.stringify(taskTabs));
  }, [taskTabs]);
  useEffect(() => {
    localStorage.getItem("tasks");
  });

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setTasks((prevTasks) => {
      return {
        ...prevTasks,
        [currentTab]: prevTasks[currentTab].map((task) => {
          if (task.id === taskId) {
            return { ...task, completed };
          }
          return task;
        }),
      };
    });
  }

  return (
    <main>
      <h1>Tasks</h1>
      <nav>
        {taskTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={tab === currentTab ? "active" : ""}
            aria-selected={tab === currentTab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section>
        <h2>{currentTab}</h2>
        <ul>
          {tasks[currentTab].map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(event) =>handleTaskToggle(task.id, event.target.checked)}
              />
              {task.description}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Tasks;

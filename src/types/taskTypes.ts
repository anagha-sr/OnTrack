type Task = {
  taskId: string;
  description: string;
  completed: boolean;
};
type Tasks = Task[];
type Tab={
      tabName: string;
      tasks: Task[];
    }
type TaskState = {
    [key: string]: Tab;
  }
export type { Task, Tasks, TaskState, Tab };


export type SingleTimerMessage =
   {
      type: "START_SINGLE_TIMER";
      duration: number;
    }
  | {
      type: "PAUSE_SINGLE_TIMER";
    }
  | {
      type: "RESUME_SINGLE_TIMER";
    }
  | {
      type: "RESET_SINGLE_TIMER";
    }
  | {
  type: "COMPLETE_SINGLE_TIMER";
  }
  ;
export type LoopTimerMessage = {
  type: "START_LOOP_TIMER";
  workDuration: number;
  restDuration: number;
}|
{
type: "PHASE_CHANGE_LOOP_TIMER";
}|
{
type: "PAUSE_LOOP_TIMER";
}|
{
type: "RESUME_LOOP_TIMER";
}|
{
type: "STOP_LOOP_TIMER";
};
export type TaskMessage = {
  type: "ADD_TASK";
  description: string;
  tabId: string;
}|
{
  type: "DELETE_TASK";
  taskId: string;
  tabId: string;
}|
{
  type: "DELETE_TASK_TAB";
  tabId: string;
}|
{
  type: "RENAME_TASK_TAB";
  tabId: string;
  newTabName: string;
}|
{
  type: "TOGGLE_TASK";
  taskId: string;
  tabId: string;
}|
{
  type: "ADD_TASK_TAB";
  taskId: string;
  tabId: string;
  tabName: string;
}



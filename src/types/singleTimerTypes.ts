
 type SingleTimerRunning = {
  status: "running";
  endTime: number; // milliseconds
};
 type SingleTimerPaused = {
  status: "paused";
  remaining: number; // milliseconds
};
 type SingleTimerIdle = { status: "idle"}
 type SingleTimerCompleted={status:"completed"}

export type SingleTimerState = SingleTimerRunning | SingleTimerPaused |SingleTimerIdle|SingleTimerCompleted;
export type SingleTimerStatus = SingleTimerState["status"];
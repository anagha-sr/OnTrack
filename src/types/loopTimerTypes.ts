type Phase = "work" | "rest"
type LoopTimerRunning = {
    status: "running"
    phase: Phase
    phaseEndTime: number
    workDuration: number
    restDuration: number
}
type LoopTimerPaused = {
    status: "paused"
    phase: Phase
    phaseRemaining: number
    workDuration: number
    restDuration: number
}
type LoopTimerWaiting = {
    status: "waiting"
    phase: Phase
    workDuration: number
    restDuration: number
}
type LoopTimerIdle = {
    status: "idle"
    workDuration: number
    restDuration: number
}
export type LoopTimerState = LoopTimerRunning | LoopTimerPaused | LoopTimerWaiting| LoopTimerIdle
export type LoopTimerStatus = LoopTimerState["status"]

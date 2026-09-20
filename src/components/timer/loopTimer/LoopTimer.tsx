import { useState, useEffect } from "react";
import type { LoopTimerState } from "../../../types/loopTimerTypes";
import useStorageValue from "../../../hooks/useStorageValue";
import LoopRunningTimer from "./LoopRunningTimer";
import LoopSetTimer from "./LoopSetTimer";

function LoopTimer() {
  const [workDuration, setWorkDuration] = useState(0); // in seconds
  const [restDuration, setRestDuration] = useState(0); // in seconds
  const [remaining, setRemaining] = useState(0); // in milliseconds
  const loopTimer = useStorageValue<LoopTimerState>(
    "loop-timer",
    {
      status: "idle",
      workDuration,
      restDuration,
    },
  );
  useEffect(() => {
    // console.log(currentTimer);
    if (loopTimer?.status === "running") {
      setRemaining(loopTimer.phaseEndTime - Date.now());
      updateRemaining();
      const interval = setInterval(() => {
        updateRemaining();
      }, 250);
      return () => clearInterval(interval);
      // setStatus(currentTimer.status);
    } else if (loopTimer?.status === "paused") {
      setRemaining(loopTimer.phaseRemaining);
      return;
    } else {
      setRemaining(0);
      //   setDuration(0);
      return;
    }
  }, [loopTimer]);
  const updateRemaining = () => {
    const remaining =
      (loopTimer?.status == "running" &&
        Math.max(0, loopTimer.phaseEndTime - Date.now())) ||
      0;
    setRemaining(remaining);
  };
  const startLoopTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "START_LOOP_TIMER",
      workDuration: workDuration * 1000,
      restDuration: restDuration * 1000,
    });
  };
  const stopLoopTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "STOP_LOOP_TIMER",
    });
  };
  const pauseLoopTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "PAUSE_LOOP_TIMER",
    });
  };
  // const resumeLoopTimer = async () => {
  //   await chrome.runtime.sendMessage({
  //     type: "RESUME_LOOP_TIMER",
  //   });
  // };
  const changePhase = async () => {
    await chrome.runtime.sendMessage({
      type: "PHASE_CHANGE_LOOP_TIMER",
    });
  };

  return (
    <div className="w-full">
      {/* Timer display */}
      {(loopTimer.status == "running" || loopTimer.status == "paused") && (
        <div>
          <p className="text-center pt-4">Remaining {loopTimer.phase} time:</p>
          <LoopRunningTimer remaining={Math.floor(remaining / 1000)} />
        </div>
      )}
      {loopTimer.status === "idle" && (
        <div>
          <LoopSetTimer
            workDuration={workDuration}
            setWorkDuration={setWorkDuration}
            restDuration={restDuration}
            setRestDuration={setRestDuration}
          />
        </div>
      )}

      {/* Messages */}
      {loopTimer.status === "waiting" && loopTimer.phase === "work" && (
        <div className="timer-message">
          <p>Your work timer has ended. <br/>
           It's time to take a break.</p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary" onClick={changePhase}>Okay</button>
            <button className="btn btn-secondary" onClick={stopLoopTimer}>Stop</button>
          </div>
        </div>
      )}
      {loopTimer.status === "waiting" && loopTimer.phase === "rest" && (
        <div className="timer-message">
          <p>Your rest timer has ended. <br/>Hope you had a good break. Let's get back to work</p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary" onClick={changePhase}>Okay</button>
            <button className="btn btn-secondary" onClick={stopLoopTimer}>Stop</button>
          </div>
        </div>
      )}
      {/* Controls */}
      <div className="timer-controls flex gap-4 justify-center mt-4">
        {loopTimer?.status === "idle" && (
          <button className="btn btn-primary" disabled={!workDuration || !restDuration} onClick={startLoopTimer}>Start</button>
        )}
        {loopTimer?.status === "running" && (
          <>
            <button className="btn btn-primary" onClick={pauseLoopTimer}>Pause</button>
            <button className="btn btn-secondary" onClick={stopLoopTimer}>Stop</button>
          </>
        )}
        {loopTimer?.status === "paused" && (
          <>
            <button className="btn btn-primary" onClick={pauseLoopTimer}>Resume</button>
            <button className="btn btn-secondary" onClick={stopLoopTimer}>Stop</button>
          </>
        )}
     
      </div>
    </div>
  );
}

export default LoopTimer;

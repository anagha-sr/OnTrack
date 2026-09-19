import { useState, useEffect } from "react";
import type {  LoopTimerState } from "../../../types/loopTimerTypes";
import useStorageValue from "../../../hooks/useStorage";
import LoopRunningTimer from "./LoopRunningTimer";
import LoopSetTimer from "./LoopSetTimer";


function LoopTimer() {
      const [workDuration, setWorkDuration] = useState(0); // in seconds
      const [restDuration, setRestDuration] = useState(0); // in seconds
      const [remaining, setRemaining] = useState(0); // in milliseconds
      const [loopTimer, setLoopTimer] = useStorageValue<LoopTimerState>("loop-timer", {
        status: "idle",
        workDuration,
        restDuration
      });
        //on page load
        useEffect(() => {
          chrome.action.setBadgeText({ text: "" });
          chrome.storage.local.get("loop-timer").then(async (result) => {
          let timer = result["loop-timer"] as LoopTimerState;
          if(!timer||(timer.status=="running"&&timer.phaseEndTime<Date.now())) {
              timer={...timer,status:"idle"}
              await chrome.storage.local.set({ "loop-timer":timer });
          }
            setLoopTimer(timer);
          }).catch((e) => console.log("On page load error", e));
        }, []);
 //updating the remaining time  based on the current timer and counting down
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
      return ;
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
  }
  const stopLoopTimer = async () => {
      await chrome.runtime.sendMessage({
        type: "STOP_LOOP_TIMER",
      })
  }
  const pauseLoopTimer = async () => {
      await chrome.runtime.sendMessage({
        type: "PAUSE_LOOP_TIMER",
      })
  }
  const resumeLoopTimer = async () => {
      await chrome.runtime.sendMessage({
        type: "RESUME_LOOP_TIMER",
      })
  }
  const changePhase = async () => {
      await chrome.runtime.sendMessage({
        type: "PHASE_CHANGE_LOOP_TIMER",
      })
  }


    return <div>
{ (loopTimer.status=="running"||loopTimer.status=="paused") &&       
<LoopRunningTimer remaining={Math.floor(remaining/1000)}  />
}
{(loopTimer.status === "waiting" && loopTimer.phase === "work") &&
<div>
  <p>Good work. Take a break</p>
  <button onClick={changePhase}>Okay</button>
  </div>
}
{(loopTimer.status === "waiting" && loopTimer.phase === "rest") &&
<div>
  <p>Hope you had a good break. Let's get back to work</p>
  <button onClick={changePhase}>Okay</button>
  </div>
}
{loopTimer.status === "idle" && <div>Set your timers
    <LoopSetTimer workDuration={workDuration} setWorkDuration={setWorkDuration} restDuration={restDuration} setRestDuration={setRestDuration} />
    </div>}
        <div className="timer-controls flex gap-2">
            {loopTimer?.status === "idle" && <button onClick={startLoopTimer}>Start</button>}
            {loopTimer?.status !== "idle" && <><button onClick={loopTimer?.status === "paused" ? resumeLoopTimer : pauseLoopTimer}>{loopTimer?.status === "paused" ? "Resume" : "Pause"}</button>
            <button onClick={stopLoopTimer}>Stop</button></>}
        </div>
              <button onClick={() => {
        chrome.storage.local.get("loop-timer").then((result) => {
          alert(JSON.stringify(result));
        })
      }}>Test storage</button>
    </div>;
}

export default LoopTimer


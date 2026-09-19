import { useState, useEffect } from "react";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import type {  SingleTimerState } from "../../types/singleTimerTypes";
import useStorageValue from "../../hooks/useStorage";

function SingleTimerState() {
  const [duration, setDuration] = useState(0); // in seconds
  const [remaining, setRemaining] = useState(0); // in milliseconds
  const [timer, setTimer] = useStorageValue<SingleTimerState>("timer", {
    status: "idle",
  });

  //fetching the current timer from the storage on page load
  useEffect(() => {
      chrome.action.setBadgeText({ text: "" });

    chrome.storage.local.get("timer").then((result) => {
    let timer = result.timer as SingleTimerState;
    if(!timer||(timer.status=="running"&&timer.endTime<Date.now())) {
        timer={status:"idle"}
        chrome.storage.local.set({ timer });
    }
      setTimer(timer);
    });
  }, []);

  //storagechange listener to update the timer 
useEffect(() => {
  const handleStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName !== "local" || !changes.timer?.newValue) return;
    setTimer(changes.timer.newValue as SingleTimerState);
  };
  chrome.storage.onChanged.addListener(handleStorageChange);

  return () => {
    chrome.storage.onChanged.removeListener(handleStorageChange);
  };
}, []);

  //updating the remaining time  based on the current timer and counting down
  useEffect(() => {
    // console.log(currentTimer);
    if (timer?.status === "running") {
      setRemaining(timer.endTime - Date.now());
      updateRemaining();
      const interval = setInterval(() => {
        updateRemaining();
      }, 250);
      return () => clearInterval(interval);
      // setStatus(currentTimer.status);
    } else if (timer?.status === "paused") {
      setRemaining(timer.remaining);
      return ;
    } else {
      setRemaining(0);
    //   setDuration(0);
      return;
    }
  }, [timer]);

  const updateRemaining = () => {
    const remaining =
      (timer?.status == "running" &&
        Math.max(0, timer.endTime - Date.now())) ||
      0;
    setRemaining(remaining);
    // if (remaining === 0) {
    //   endTimer();
    // }
  };

  const startTimer = async (duration: number) => {
    const result = await chrome.runtime.sendMessage({
      type: "START_TIMER",
      duration: duration * 1000,
    });
    setTimer(result.timer);
  };
//   const endTimer = async () => {
//     setCurrentTimer({ status: "completed" });
//   }

  const resetTimer = async () => {
    const result = await chrome.runtime.sendMessage({
      type: "RESET_TIMER",
    });
    setTimer(result.timer);
  };
  const pauseTimer = async () => {
    const result = await chrome.runtime.sendMessage({
      type: "PAUSE_TIMER",
    });
    setTimer(result.timer);
  };
  const resumeTimer = async () => {
    const result = await chrome.runtime.sendMessage({
      type: "RESUME_TIMER",
    });
    setTimer(result.timer);
  }

  return (
    <div>
      <TimerDisplay remaining={Math.round(remaining / 1000)} duration={duration} setDuration={setDuration} timerStatus={timer.status} />

      <TimerControls
        startTimer={() => startTimer(duration)}
        pauseTimer={() => pauseTimer()}
        resetTimer={() => resetTimer()}
        resumeTimer={() => resumeTimer()}
        timerStatus={timer.status}
      />
      <button onClick={() => {
        chrome.storage.local.get("timer").then((result) => {
          alert(JSON.stringify(result));
        })
      }}>Test storage</button>
    </div>
  );
}

export default SingleTimerState;

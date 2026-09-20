import { useState, useEffect } from "react";
import SingleTimerDisplay from "./SingleTimerDisplay";
import type { SingleTimerState } from "../../../types/singleTimerTypes";
import useStorageValue from "../../../hooks/useStorageValue";

function SingleTimer() {
  const [duration, setDuration] = useState(0); // in seconds
  const [remaining, setRemaining] = useState(0); // in milliseconds
  const singleTimer = useStorageValue<SingleTimerState>(
    "single-timer",
    {
      status: "idle",
    },
  );

  // //on page load
  // useEffect(() => {
  //   try {
  //     chrome.storage.local
  //       .get("single-timer")
  //       .then(async (result) => {
  //         let timer = result["single-timer"] as SingleTimerState;
  //         if (
  //           !timer ||
  //           (timer.status == "running" && timer.endTime < Date.now())
  //         ) {
  //           timer = { status: "idle" };
  //           await chrome.storage.local.set({ "single-timer": timer });
  //         }
  //         setSingleTimer(timer);
  //       })
  //       .catch((e) => console.log("On page load error", e));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);
  //updating the remaining time  based on the current timer and counting down
  useEffect(() => {
    // console.log(currentTimer);
    if (singleTimer?.status === "running") {
      setRemaining(singleTimer.endTime - Date.now());
      updateRemaining();
      const interval = setInterval(() => {
        updateRemaining();
      }, 250);
      return () => clearInterval(interval);
      // setStatus(currentTimer.status);
    } else if (singleTimer?.status === "paused") {
      setRemaining(singleTimer.remaining);
      return;
    } else {
      setRemaining(0);
      //   setDuration(0);
      return;
    }
  }, [singleTimer]);

  const updateRemaining = () => {
    const remaining =
      (singleTimer?.status == "running" &&
        Math.max(0, singleTimer.endTime - Date.now())) ||
      0;
    setRemaining(remaining);
  };

  const startTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "START_SINGLE_TIMER",
      duration: duration * 1000,
    });
  };
  const resetTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "RESET_SINGLE_TIMER",
    });
  };
  const pauseTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "PAUSE_SINGLE_TIMER",
    });
  };
  const resumeTimer = async () => {
    await chrome.runtime.sendMessage({
      type: "RESUME_SINGLE_TIMER",
    });
  };
  const handlePauseResume = () => {
    if (singleTimer.status === "paused") {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  return (
    <div>
      {/* Timer Display */}
      <SingleTimerDisplay
        remaining={Math.round(remaining / 1000)}
        duration={duration}
        setDuration={setDuration}
        timerStatus={singleTimer.status}
      />
{/* Messages */}
{
  singleTimer.status === "completed" && (
  <div className="text-center mt-4">
    <p className="text-lg font-semibold">Timer ended.</p>
  </div>
)}
      {/* Controls */}

      <div className="timer-controls flex justify-center gap-4 mt-4">
        {singleTimer.status === "idle" && (
          <button
            className="btn btn-primary"
            disabled={!duration}
            onClick={startTimer}
          >
            Start
          </button>
        )}
        {singleTimer.status === "paused" && (
          <>
            <button className="btn btn-primary" onClick={handlePauseResume}>
              Resume
            </button>
            <button className="btn btn-secondary" onClick={resetTimer}>
              Stop
            </button>
          </>
        )}
        {singleTimer.status === "running" && (
          <>
            <button className="btn btn-primary" onClick={handlePauseResume}>
              Pause
            </button>
            <button className="btn btn-secondary" onClick={resetTimer}>
              Stop
            </button>
          </>
        )}
        {singleTimer.status === "completed" && (
          <button className="btn btn-primary" onClick={resetTimer}>
            Okay
          </button>
        )}
      </div>
    </div>
  );
}

export default SingleTimer;

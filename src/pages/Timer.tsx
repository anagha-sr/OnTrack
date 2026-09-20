import { useState } from "react";
import SingleTimer from "../components/timer/singleTimer/SingleTimer";
import LoopTimer from "../components/timer/loopTimer/LoopTimer";
import useStorageValueReadOnly from "../hooks/useStorageReadOnly";
import type { SingleTimerState } from "../types/singleTimerTypes";
import type { LoopTimerState } from "../types/loopTimerTypes";

const timerTabs = [
  { id: "loop-timer", label: "Work-Rest Loop"  },
  { id: "single-timer", label: "One Time" },
] as const;
type TimerTab = (typeof timerTabs)[number]["id"];

function Timer() {
  const [currentTab, setCurrentTab] = useState<TimerTab>('loop-timer');
  const currentSingleTimer =useStorageValueReadOnly<SingleTimerState>("single-timer");
  const currentLoopTimer =useStorageValueReadOnly<LoopTimerState>("loop-timer");

  return <section>
    <h2 className="sr-only">Timer</h2>
    <nav className="sub-tabs ">
      {timerTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`sub-tab ${tab.id === currentTab ? "active" : ""}`}
          aria-selected={tab.id === currentTab}
        >
          {tab.label}
          {tab.id === 'loop-timer' && currentLoopTimer?.status === "waiting" && (
            <span className="sub-tab-badge">!</span>
            
          )}
          {tab.id === 'single-timer' && currentSingleTimer?.status === "completed" && (
            <span className="sub-tab-badge">!</span>
          )}
        </button>
      ))}
    </nav>
    <div className="content">
            {currentTab === 'loop-timer' && <LoopTimer />}
      {currentTab === 'single-timer' && <SingleTimer />}
    </div>
  </section>;
}

export default Timer;

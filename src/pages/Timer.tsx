import { useState } from "react";
import SingleTimer from "../components/timer/singleTimer/SingleTimer";
import LoopTimer from "../components/timer/loopTimer/LoopTimer";

const timerTabs = [
    { id: "loop-timer", label: "Work-Rest Loop" },
  { id: "single-timer", label: "One Time" },
] as const;
type TimerTab = (typeof timerTabs)[number]["id"];

function Timer() {
  const [currentTab, setCurrentTab] = useState<TimerTab>('loop-timer');
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

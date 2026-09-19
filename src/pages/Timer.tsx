import { useState } from "react";
import SingleTimer from "../components/timer/singleTimer/SingleTimer";
import LoopTimer from "../components/timer/loopTimer/LoopTimer";

const timerTabs = [
  { id: "single-timer", label: "One Time" },
  { id: "loop-timer", label: "Repeating" },
] as const;
type TimerTab = (typeof timerTabs)[number]["id"];

function Timer() {
  const [currentTab, setCurrentTab] = useState<TimerTab>('single-timer');
  return <main>
    <h1 >Timer</h1>
    <nav>
      {timerTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={tab.id === currentTab ? 'active' : ''}
          aria-selected={tab.id === currentTab}
        >
          {tab.label}
        </button>
      ))}
    </nav>
    <section>
      {currentTab === 'single-timer' && <SingleTimer />}
      {currentTab === 'loop-timer' && <LoopTimer />}
    </section>
  </main>;
}

export default Timer;

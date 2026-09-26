import { useState } from "react";

import TimerPage from "./pages/TimerPage";
import TasksPage from "./pages/TasksPage";
import TrackerPage from "./pages/TrackerPage";


import "./App.css";
import Footer from "./components/common/Footer";
import useStorageValueReadOnly from "./hooks/useStorageReadOnly";
import type { SingleTimerState } from "./types/singleTimerTypes";
import type { LoopTimerState } from "./types/loopTimerTypes";
import JotsPage from "./pages/JotsPage";

const mainTabs = [
  { id: "timer", label: "Timer" },
  { id: "tasks", label: "Tasks" },
  { id: "tracker", label: "Tracker" },
  { id: "jots", label: "Jots" },
] as const;

type MainTabId = (typeof mainTabs)[number]["id"];

function App() {
  const [currentTab, setCurrentTab] = useState<MainTabId>("timer");
  const currentSingleTimer =
    useStorageValueReadOnly<SingleTimerState>("single-timer");
  const currentLoopTimer =
    useStorageValueReadOnly<LoopTimerState>("loop-timer");

  return (
    <>
      <header>
        <nav className="main-tabs ">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`${tab.id === currentTab ? "active" : ""} main-tab`}
              aria-selected={tab.id === currentTab}
            >
              {tab.label}
              {/* badges */}
              {tab.id !== currentTab && (
                <>
                  {/* timer */}
                  {tab.id === "timer" &&
                    (currentLoopTimer?.status === "waiting" ||
                      currentSingleTimer?.status === "completed") && (
                      <span className="main-tab-badge">!</span>
                    )}
                </>
              )}
            </button>
          ))}
        </nav>
      </header>
      <main>
        <h1 className="sr-only">On Track.</h1>
        {currentTab === "timer" && <TimerPage />}
        {currentTab === "tasks" && <TasksPage />}
        {currentTab === "tracker" && <TrackerPage />}
        {currentTab === "jots" && <JotsPage />}
      </main>

      {/* <button
        onClick={() => {
          chrome.storage.local.get("single-timer").then((result) => {
            alert(JSON.stringify(result));
          });
        }}
      >
        Test storage-single
      </button>
      <br />
      <button
        onClick={() => {
          chrome.storage.local.get("loop-timer").then((result) => {
            alert(JSON.stringify(result));
          });
        }}
      >
        Test storage-loop
      </button> */}
      {/* <button
        onClick={() => {
          chrome.storage.local.get("taskstate").then((result) => {
            alert(JSON.stringify(result));
          })
        }}
      >
        Test taskstate
      </button> */}
      <Footer />
    </>
  );
}

export default App;

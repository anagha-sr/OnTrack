import { useState } from 'react'
import Timer from './pages/Timer'
import Tasks from './pages/Tasks'

import './App.css'
const mainTabs =  [
  { id: "timer", label: "Timer" },
  { id: "tasks", label: "Tasks" },
  { id: "tracker", label: "Tracker" },
] as const;
type MainTabId = typeof mainTabs[number]['id'];

function App() {
  const [currentTab, setCurrentTab] = useState<MainTabId>('timer')

  return (
  <>
    <header>
      <nav>
        {mainTabs.map((tab) => (
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
    </header>
    {currentTab === 'timer' && <Timer/>}
    {currentTab === 'tasks' && <Tasks/>}
  </>
  )
}

export default App

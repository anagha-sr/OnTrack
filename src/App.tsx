import { useState, useEffect } from 'react'
import Timer from './pages/Timer'
import Tasks from './pages/Tasks'


import './App.css'
import Footer from './components/common/Footer';
const mainTabs =  [
  { id: "timer", label: "Timer" },
  { id: "tasks", label: "Tasks" },
  { id: "tracker", label: "Tracker" },
] as const;
type MainTabId = typeof mainTabs[number]['id'];

function App() {
  const [currentTab, setCurrentTab] = useState<MainTabId>('timer')
  useEffect(() => {
    chrome.storage.session.set({ popupOpen: true });

    try {
      chrome.action.setBadgeText({ text: "" })
    } catch (error) {
      console.log(error);
    }
      return () => {
    chrome.storage.session.set({ popupOpen: false });;
  };
  }, [])

  return (
  <>
    <header>
      <nav className="main-tabs ">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`${tab.id === currentTab ? 'active' : ''} main-tab`}
            aria-selected={tab.id === currentTab}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
    <main>
      <h1 className="sr-only">On Track.</h1>
    {currentTab === 'timer' && <Timer/>}
    {currentTab === 'tasks' && <Tasks/>}
    </main>
    <Footer/>
  </>
  )
}

export default App

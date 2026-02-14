
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Calculator from './components/Calculator';
import { HistoryItem } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans select-none">
      {/* Sidebar for History - Hidden on mobile unless toggled */}
      <div className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        transition-all duration-300 ease-in-out border-r border-zinc-800 
        overflow-hidden hidden md:block
      `}>
        <Sidebar 
          history={history} 
          onClear={clearHistory} 
          onDeleteItem={deleteHistoryItem}
        />
      </div>

      {/* Main Calculator Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Toggle Sidebar Button (Top Left) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 left-6 z-10 p-2 text-orange-500 hover:bg-zinc-900 rounded-lg transition-colors hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>

        <Calculator onCalculate={addToHistory} />
      </div>
    </div>
  );
};

export default App;

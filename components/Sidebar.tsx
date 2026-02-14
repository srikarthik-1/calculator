
import React from 'react';
import { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onClear: () => void;
  onDeleteItem: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onClear, onDeleteItem }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-zinc-500 font-medium">History</h2>
        <button 
          onClick={onClear}
          className="text-orange-500 text-sm hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        {history.length === 0 ? (
          <p className="text-zinc-700 text-sm text-center mt-10">No recent calculations</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="group relative flex flex-col items-end space-y-1">
              <button 
                onClick={() => onDeleteItem(item.id)}
                className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-zinc-500 text-sm font-light truncate w-full text-right">
                {item.expression}
              </span>
              <span className="text-white text-2xl font-normal">
                {item.result}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;

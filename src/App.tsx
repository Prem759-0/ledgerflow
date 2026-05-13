import React from 'react';
import { CommandPalette } from './components/CommandPalette';
import { KanbanBoard } from './components/KanbanBoard';
import { useOrbitStore } from './store/useOrbitStore';
import { 
  Planet, Inbox, LayoutDashboard, CheckSquare, 
  Users, Settings, Search, Command
} from 'lucide-react';

const App: React.FC = () => {
  const { setCommandPaletteOpen } = useOrbitStore();

  return (
    <div className="flex h-screen w-screen bg-[#0E0E11] text-zinc-200 overflow-hidden font-sans antialiased selection:bg-indigo-500/30">
      <CommandPalette />

      {/* Left Sidebar */}
      <aside className="w-64 border-r border-zinc-800/60 bg-[#0E0E11] flex flex-col flex-shrink-0 z-10">
        <div className="h-14 flex items-center px-4 border-b border-zinc-800/60 gap-3 hover:bg-zinc-800/30 cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Planet className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-100">Orbit Workspace</span>
        </div>

        <div className="p-3">
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-zinc-400 group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">Search</span>
            </div>
            <div className="flex items-center gap-0.5 opacity-60">
              <Command className="w-3 h-3" />
              <span className="text-xs font-mono font-bold">K</span>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 mt-2">Your Views</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-colors">
            <Inbox className="w-4 h-4" /> Inbox
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-zinc-800/80 rounded-lg shadow-sm border border-zinc-700/50">
            <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Active Board
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-colors">
            <CheckSquare className="w-4 h-4" /> My Issues
          </a>

          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 mt-6">Workspace</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-colors">
            <Users className="w-4 h-4" /> Team
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0E0E11] relative">
        {/* Subtle top gradient like Linear */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        <header className="h-14 border-b border-zinc-800/60 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <LayoutDashboard className="w-3 h-3 text-indigo-400" />
            </div>
            <h2 className="font-semibold text-sm text-zinc-100 tracking-tight">Active Board</h2>
          </div>
          
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-md font-medium text-xs transition-colors shadow-sm shadow-indigo-500/20">
            New Issue
          </button>
        </header>

        <KanbanBoard />
      </main>
    </div>
  );
};

export default App;

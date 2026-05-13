import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useOrbitStore } from '../store/useOrbitStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, tasks, searchQuery, setSearchQuery } = useOrbitStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'done': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Circle className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#1C1C1E] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center px-4 py-3 border-b border-zinc-800/80">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search issues..."
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-500 text-lg font-medium"
            />
            <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded-md">
              <Command className="w-3 h-3" /> K
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No results found for "{searchQuery}"</div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Issues</div>
                {filteredTasks.map(task => (
                  <button key={task.id} className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-zinc-800/50 transition-colors text-left group">
                    {getStatusIcon(task.status)}
                    <span className="text-zinc-500 font-mono text-xs w-16">{task.id}</span>
                    <span className="text-zinc-200 font-medium flex-1 group-hover:text-white transition-colors truncate">{task.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'urgent' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

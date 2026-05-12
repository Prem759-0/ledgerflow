import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer2, Hand, StickyNote, Moon, Sun, 
  Share2, Users, Minus, Plus, Maximize
} from 'lucide-react';
import { useBoardStore } from './store/useBoardStore';
import { BoardArea } from './components/Board/BoardArea';

const App: React.FC = () => {
  const { activeTool, setTool, zoom, setZoom, setPan, cursors, myCursorId } = useBoardStore();

  const toggleTheme = () => document.documentElement.classList.toggle('dark');
  
  // Calculate active users
  const activeUsersCount = Object.keys(cursors).filter(id => id !== myCursorId).length + 1;

  // Spacebar hotkey for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space' && activeTool !== 'hand') setTool('hand'); };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setTool('select'); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [setTool, activeTool]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      
      {/* Top Left Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-50 flex items-center gap-4 bg-card/80 backdrop-blur-xl border border-border p-2.5 rounded-2xl shadow-xl"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <div className="pr-2">
          <h1 className="font-bold text-sm tracking-tight leading-none">SyncBoard Space</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">{activeUsersCount} Active</span>
          </div>
        </div>
      </motion.header>

      {/* Top Right Controls */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl"
      >
        <div className="flex -space-x-2 mr-2 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-card text-[10px] font-bold text-white shadow-sm z-10">You</div>
          {Object.keys(cursors).filter(id => id !== myCursorId).slice(0, 3).map((id, i) => (
             <div key={id} className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-card shadow-sm text-white" style={{ backgroundColor: cursors[id].color, zIndex: 9 - i }}>
                <Users className="w-3.5 h-3.5" />
             </div>
          ))}
        </div>
        <div className="w-px h-6 bg-border" />
        <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-secondary text-foreground transition-colors">
          <Sun className="w-4 h-4 dark:hidden" /><Moon className="w-4 h-4 hidden dark:block" />
        </button>
        <button className="px-4 py-2.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-md">
          Share
        </button>
      </motion.div>

      {/* Center Floating Toolbar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card/90 backdrop-blur-2xl border border-border p-2 rounded-2xl shadow-2xl"
      >
        <button 
          onClick={() => setTool('select')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'select' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <MousePointer2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setTool('hand')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'hand' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Hand className="w-5 h-5" />
        </button>
        <div className="w-px h-8 bg-border mx-1" />
        <button 
          onClick={() => setTool('note')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'note' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <StickyNote className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Bottom Right Zoom Controls */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-8 right-6 z-50 flex items-center bg-card/80 backdrop-blur-xl border border-border p-1.5 rounded-xl shadow-xl"
      >
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.2))} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Minus className="w-4 h-4" /></button>
        <button onClick={() => { setZoom(1); setPan({x:0, y:0}); }} className="px-3 text-xs font-mono font-bold hover:bg-secondary rounded-lg flex items-center gap-2 text-foreground transition-colors">
          {(zoom * 100).toFixed(0)}%
        </button>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
      </motion.div>

      {/* The Core Canvas */}
      <BoardArea />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ArrowRightLeft, Building2, Users, 
  Settings, Bell, Plus, Search, Command, Zap, ChevronsUpDown, LogOut
} from 'lucide-react';

// Core Components
import { HealthDashboard } from './components/Analytics/HealthDashboard';
import { MetricsChart } from './components/Dashboard/MetricsChart';
import { TransactionList } from './components/Transactions/TransactionList';
import { AutomationBoard } from './components/Workflows/AutomationBoard';
import { TrialBalance } from './components/Accounting/TrialBalance';

type TabType = 'dashboard' | 'final-accounts' | 'automations';

const App: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Professional Terminal Shortcuts (Alt + 1, 2, 3 to switch tabs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') { e.preventDefault(); setActiveTab('dashboard'); }
      if (e.altKey && e.key === '2') { e.preventDefault(); setActiveTab('final-accounts'); }
      if (e.altKey && e.key === '3') { e.preventDefault(); setActiveTab('automations'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-zinc-200 overflow-hidden font-sans antialiased selection:bg-emerald-500/30">
      
      {/* Enterprise Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col flex-shrink-0 z-20 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-emerald-500/5 blur-[80px] pointer-events-none" />
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-white/10">
            <Building2 className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight text-white leading-none">LedgerFlow</h1>
            <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Institutional</span>
          </div>
        </div>

        {/* Navigation Map */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar relative z-10">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-2 mb-1 flex justify-between items-center">
            Core Modules <span className="font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded">ALT 1-3</span>
          </div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Strategic Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('final-accounts')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === 'final-accounts' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'}`}

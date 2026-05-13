import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ArrowRightLeft, Building2, Users, 
  Settings, Bell, Plus, Search, Command, Zap, ChevronsUpDown, 
  TrendingUp, TrendingDown, Terminal
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const isCommandMode = searchQuery.startsWith('/');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-zinc-200 overflow-hidden font-sans antialiased selection:bg-emerald-500/30">
      
      {/* NEW: Bloomberg-Style Ticker Tape */}
      <div className="h-7 bg-[#111113] border-b border-white/5 flex items-center overflow-hidden shrink-0 relative z-30">
        <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-[#111113] to-transparent z-10" />
        <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-[#111113] to-transparent z-10" />
        <motion.div 
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
          className="flex items-center gap-8 whitespace-nowrap text-[10px] font-mono font-bold tracking-widest uppercase"
        >
          <span className="flex items-center gap-2"><span className="text-zinc-500">REALIZATION SURPLUS</span> <span className="text-emerald-400">$850,000</span> <TrendingUp className="w-3 h-3 text-emerald-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">OPERATING BURN</span> <span className="text-rose-400">-$45,200/mo</span> <TrendingDown className="w-3 h-3 text-rose-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">PARTNER CAPITAL (A)</span> <span className="text-emerald-400">$600,000</span> <TrendingUp className="w-3 h-3 text-emerald-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">INSTITUTIONAL DEBT</span> <span className="text-zinc-300">$450,000</span> <TrendingDown className="w-3 h-3 text-zinc-500" /></span>
          {/* Duplicate for seamless infinite scroll */}
          <span className="flex items-center gap-2"><span className="text-zinc-500">REALIZATION SURPLUS</span> <span className="text-emerald-400">$850,000</span> <TrendingUp className="w-3 h-3 text-emerald-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">OPERATING BURN</span> <span className="text-rose-400">-$45,200/mo</span> <TrendingDown className="w-3 h-3 text-rose-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">PARTNER CAPITAL (A)</span> <span className="text-emerald-400">$600,000</span> <TrendingUp className="w-3 h-3 text-emerald-500" /></span>
          <span className="flex items-center gap-2"><span className="text-zinc-500">INSTITUTIONAL DEBT</span> <span className="text-zinc-300">$450,000</span> <TrendingDown className="w-3 h-3 text-zinc-500" /></span>
        </motion.div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Enterprise Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col flex-shrink-0 z-20 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-40 bg-emerald-500/5 blur-[80px] pointer-events-none" />
          
          {/* Brand Header */}
          <div className="h-20 flex items-center px-6 gap-3 shrink-0">
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
            >
              <ArrowRightLeft className="w-4 h-4" /> Final Accounts
            </button>
            
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-2 mt-6 mb-1">Workflows & Logic</div>
            
            <button 
              onClick={() => setActiveTab('automations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === 'automations' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'}`}
            >
              <Zap className="w-4 h-4" /> Routing Automations
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all border border-transparent">
              <Users className="w-4 h-4" /> Capital Partners
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all border border-transparent">
              <Settings className="w-4 h-4" /> Settings & Compliance
            </button>
          </nav>

          {/* Workspace Selector Mockup */}
          <div className="p-4 border-t border-white/5 bg-white/[0.02] shrink-0">
            <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-400">
                  AC
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Apex Capital</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Fund I</p>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative z-10">
          
          {/* Global Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl relative">
            <div className={`flex items-center gap-3 bg-[#111113] border transition-all rounded-xl px-4 py-2 w-96 shadow-inner relative overflow-hidden ${searchFocused ? (isCommandMode ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-emerald-500/50 ring-1 ring-emerald-500/20') : 'border-white/5'}`}>
              
              {/* CLI Command Mode Glow */}
              {isCommandMode && <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />}
              
              {isCommandMode ? <Terminal className="w-4 h-4 text-indigo-500" /> : <Search className={`w-4 h-4 transition-colors ${searchFocused ? 'text-emerald-500' : 'text-zinc-500'}`} />}
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledgers, or type '/' for CLI..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`flex-1 bg-transparent border-none outline-none text-sm placeholder:text-zinc-600 font-medium relative z-10 ${isCommandMode ? 'text-indigo-300 font-mono' : 'text-zinc-100'}`}
              />
              
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono bg-white/5 border border-white/5 px-1.5 py-0.5 rounded shadow-sm relative z-10">
                {isCommandMode ? 'ENTER' : <><Command className="w-3 h-3" /> K</>}
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="relative p-2 text-zinc-400 hover:text-white transition-colors group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0a0a] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </button>
              <div className="w-px h-6 bg-white/10" />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2 active:scale-95">
                <Plus className="w-4 h-4" /> Book Entry
              </button>
            </div>
          </header>

          {/* Dynamic Route Content */}
          <div className="flex-1 overflow-y-auto relative z-10 no-scrollbar">
            <AnimatePresence mode="wait">
              
              {/* TAB: AUTOMATIONS */}
              {activeTab === 'automations' && (
                <motion.div key="automations" {...pageTransition} className="min-h-full">
                  <AutomationBoard />
                </motion.div>
              )}

              {/* TAB: FINAL ACCOUNTS */}
              {activeTab === 'final-accounts' && (
                <motion.div key="final-accounts" {...pageTransition} className="p-8 min-h-full">
                  <TrialBalance />
                </motion.div>
              )}

              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" {...pageTransition} className="p-8 min-h-full">
                  <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    
                    {/* Row 1: Strategic Intelligence */}
                    <HealthDashboard />
                    
                    {/* Row 2: Recharts Analytics */}
                    <MetricsChart />
                    
                    {/* Row 3: Live Ledger & KPIs */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                      
                      {/* Left: Swipable Ledger */}
                      <div className="lg:col-span-2 h-full relative">
                        <TransactionList />
                      </div>
                      
                      {/* Right: Institutional KPIs */}
                      <div className="h-full flex flex-col gap-6">
                        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl transition-opacity opacity-50 group-hover:opacity-100" />
                           <div className="absolute -bottom-4 -right-4 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors pointer-events-none">
                              <Building2 className="w-40 h-40" />
                           </div>
                           <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-2 relative z-10">Realization Surplus</h4>
                           <p className="font-display font-bold text-4xl text-white relative z-10">$850,000</p>
                           <p className="text-xs text-emerald-400 font-medium mt-3 flex items-center gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded-md relative z-10">
                             +12.4% Asset Valuation
                           </p>
                        </div>
                        
                        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl transition-opacity opacity-50 group-hover:opacity-100" />
                           <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-2 relative z-10">Operating Deficit</h4>
                           <p className="font-display font-bold text-4xl text-white relative z-10">$45,200 <span className="text-lg text-zinc-600 font-normal">/mo</span></p>
                           <p className="text-xs text-zinc-500 font-medium mt-3 relative z-10">Pre Final Accounts P&L</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

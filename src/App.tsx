import React, { useState } from 'react';
import { 
  LayoutDashboard, ArrowRightLeft, Building2, Users, 
  Settings, Bell, Plus, Search, Command
} from 'lucide-react';
import { MetricsChart } from './components/Dashboard/MetricsChart';
import { TransactionList } from './components/Transactions/TransactionList';

const App: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-zinc-200 overflow-hidden font-sans antialiased selection:bg-emerald-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col flex-shrink-0 z-10 shadow-2xl relative">
        {/* Subtle glow behind logo */}
        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
        
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/10">
            <Building2 className="w-5 h-5 text-emerald-950" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">LedgerFlow</span>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto no-scrollbar relative z-10">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 mb-1">Core Modules</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white bg-white/5 rounded-xl border border-white/5 shadow-sm transition-all group">
            <LayoutDashboard className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all">
            <ArrowRightLeft className="w-4 h-4" /> Ledger Entries
          </a>
          
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 mt-6 mb-1">Institutional</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all">
            <Building2 className="w-4 h-4" /> Capital Accounts
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all">
            <Users className="w-4 h-4" /> Realization Engine
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-4 h-4" /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-10 bg-white/[0.02] backdrop-blur-md">
          <div className={`flex items-center gap-3 bg-[#111113] border transition-colors rounded-xl px-4 py-2 w-96 shadow-inner ${searchFocused ? 'border-emerald-500/50' : 'border-white/5'}`}>
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search entities, TXN IDs, or amounts..." 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder:text-zinc-600"
            />
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">
              <Command className="w-3 h-3" /> F
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0a0a]"></span>
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Entry
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 no-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Top Row: Chart */}
            <MetricsChart />
            
            {/* Bottom Row: Ledger List & Secondary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
              <div className="lg:col-span-2 h-full">
                <TransactionList />
              </div>
              
              <div className="h-full flex flex-col gap-6">
                <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl transition-opacity opacity-50 group-hover:opacity-100" />
                   <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-2">Liquidation Reserve</h4>
                   <p className="font-display font-bold text-3xl text-white">$1,250,000</p>
                   <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">+4.2% from Q2</p>
                </div>
                <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl transition-opacity opacity-50 group-hover:opacity-100" />
                   <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-2">OpEx Burn Rate</h4>
                   <p className="font-display font-bold text-3xl text-white">$45,200 <span className="text-sm text-zinc-500 font-normal">/mo</span></p>
                   <p className="text-xs text-zinc-500 font-medium mt-2">18 months runway</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowDown, Database, GitMerge, FileText, Plus, UserMinus, UserPlus } from 'lucide-react';

export const AutomationBoard: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-3xl p-8 overflow-y-auto no-scrollbar relative flex flex-col items-center pt-12">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Automated Ledger Routing</h2>
        <p className="text-zinc-400 text-sm">Configure event-driven workflows for institutional accounts and compliance.</p>
      </div>

      <div className="flex flex-col items-center relative z-10 w-full max-w-xl pb-20">
        
        {/* Trigger Node */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[#111113] border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.1)] group hover:border-emerald-500/60 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 block">Trigger Event</span>
              <h3 className="text-white font-semibold">Death of a Partner</h3>
              <p className="text-xs text-zinc-500 mt-1">Initiates capital settlement and executor account transfer.</p>
            </div>
          </div>
        </motion.div>

        <div className="h-8 w-px bg-gradient-to-b from-emerald-500/50 to-indigo-500/50 my-1 flex items-center justify-center">
          <ArrowDown className="w-3 h-3 text-zinc-600 bg-[#0a0a0a]" />
        </div>

        {/* Action Node 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full bg-[#111113] border border-white/5 rounded-2xl p-5 hover:bg-[#151517] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <UserMinus className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1 block">Capital Revaluation</span>
              <h3 className="text-white font-semibold">Calculate Goodwill & Reserves</h3>
              <p className="text-xs text-zinc-500 mt-1">Revalue assets and distribute to deceased partner's capital account.</p>
            </div>
          </div>
        </motion.div>

        <div className="h-8 w-px bg-gradient-to-b from-indigo-500/50 to-amber-500/50 my-1 flex items-center justify-center">
          <ArrowDown className="w-3 h-3 text-zinc-600 bg-[#0a0a0a]" />
        </div>

        {/* Action Node 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full bg-[#111113] border border-white/5 rounded-2xl p-5 hover:bg-[#151517] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 block">Routing Action</span>
              <h3 className="text-white font-semibold">Transfer to Executor's Loan A/c</h3>
              <p className="text-xs text-zinc-500 mt-1">Settle final balance to the legal executor with 6% p.a. interest.</p>
            </div>
          </div>
        </motion.div>

        <div className="h-8 w-px bg-gradient-to-b from-amber-500/50 to-blue-500/50 my-1 flex items-center justify-center">
          <ArrowDown className="w-3 h-3 text-zinc-600 bg-[#0a0a0a]" />
        </div>

        {/* Action Node 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full bg-[#111113] border border-white/5 rounded-2xl p-5 hover:bg-[#151517] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 block">Reporting Action</span>
              <h3 className="text-white font-semibold">Reconstitute Final Accounts</h3>
              <p className="text-xs text-zinc-500 mt-1">Adjust New Profit Sharing Ratio (NPSR) for remaining partners.</p>
            </div>
          </div>
        </motion.div>

        <button className="mt-8 w-12 h-12 rounded-full border border-dashed border-zinc-600 hover:border-emerald-500 hover:bg-emerald-500/10 flex items-center justify-center transition-all group">
          <Plus className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLedgerStore } from '../../store/useLedgerStore';

export const TrialBalance: React.FC = () => {
  const { getTrialBalance } = useLedgerStore();
  const trialBalance = getTrialBalance();

  // Added strict typing here to fix Vercel TS7006 errors
  const totalDebit = trialBalance.reduce((acc: number, curr: { debit: number }) => acc + curr.debit, 0);
  const totalCredit = trialBalance.reduce((acc: number, curr: { credit: number }) => acc + curr.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Scale className="w-8 h-8 text-emerald-500" />
            Trial Balance & Final Accounts
          </h2>
          <p className="text-zinc-400 text-sm mt-2">Automated ledger reconciliation as of {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-lg ${isBalanced ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {isBalanced ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="font-bold text-sm tracking-widest uppercase">{isBalanced ? 'Books Balanced' : 'Suspense Detected'}</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[#111113] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/10 bg-[#151517] text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <div className="col-span-6">Particulars (Heads of Accounts)</div>
          <div className="col-span-2 text-center">L.F.</div>
          <div className="col-span-2 text-right text-emerald-400/70">Debit ($)</div>
          <div className="col-span-2 text-right text-emerald-400/70">Credit ($)</div>
        </div>

        <div className="flex flex-col">
          {trialBalance.map((item: { category: string; debit: number; credit: number }, index: number) => (
            <div key={item.category} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-6 flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-zinc-600" />
                <span className="font-semibold text-zinc-200">{item.category} Account</span>
              </div>
              <div className="col-span-2 text-center text-xs font-mono text-zinc-600">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="col-span-2 text-right font-mono font-medium text-zinc-300">
                {item.debit > 0 ? formatCurrency(item.debit) : '-'}
              </div>
              <div className="col-span-2 text-right font-mono font-medium text-zinc-300">
                {item.credit > 0 ? formatCurrency(item.credit) : '-'}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4 px-8 py-6 bg-emerald-500/5 border-t-2 border-emerald-500/30">
          <div className="col-span-8 text-right font-bold text-sm text-emerald-500 uppercase tracking-widest">Grand Total</div>
          <div className="col-span-2 text-right font-display font-bold text-lg text-emerald-400 border-double border-b-4 border-emerald-500/50 pb-1">
            {formatCurrency(totalDebit)}
          </div>
          <div className="col-span-2 text-right font-display font-bold text-lg text-emerald-400 border-double border-b-4 border-emerald-500/50 pb-1">
            {formatCurrency(totalCredit)}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

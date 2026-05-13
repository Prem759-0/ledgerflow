import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowDownRight, ArrowUpRight, Trash2, Landmark } from 'lucide-react';
import { useLedgerStore } from '../../store/useLedgerStore';

export const TransactionList: React.FC = () => {
  const { transactions, removeTransaction } = useLedgerStore();

  const formatCurrency = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    return type === 'credit' ? `+${formatted}` : `-${formatted}`;
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Institutional') || category.includes('Capital') || category.includes('Realization')) return <Landmark className="w-4 h-4 text-indigo-400" />;
    return <Building2 className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <div className="w-full bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-zinc-100 text-lg font-semibold tracking-tight">Ledger Entries</h3>
        <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest">View Final Accounts</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
              className="relative group rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end px-6 rounded-2xl">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>

              <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                onDragEnd={(_, info) => { if (info.offset.x < -50) removeTransaction(tx.id); }}
                className="relative flex items-center justify-between p-4 bg-[#1C1C1E] border border-white/5 rounded-2xl cursor-grab active:cursor-grabbing hover:bg-[#222224] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                    tx.type === 'credit' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    {tx.type === 'credit' ? <ArrowUpRight className="w-5 h-5 text-emerald-500" /> : <ArrowDownRight className="w-5 h-5 text-red-500" />}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">{tx.entity}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getCategoryIcon(tx.category)}
                      <span className="text-xs text-zinc-500 font-medium">{tx.category}</span>
                      <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline-block"> • {tx.id}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-display font-bold text-base ${tx.type === 'credit' ? 'text-emerald-500' : 'text-zinc-100'}`}>
                    {formatCurrency(tx.amount, tx.type)}
                  </span>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5 max-w-[120px] truncate">{tx.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

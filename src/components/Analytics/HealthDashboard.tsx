import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Zap, TrendingDown } from 'lucide-react';
import { useLedgerStore } from '../../store/useLedgerStore';

export const HealthDashboard: React.FC = () => {
  const { getFinancialHealth } = useLedgerStore();
  const health = getFinancialHealth();

  const cards = [
    { label: 'Current Ratio', value: health.currentRatio.toFixed(2), icon: <Activity className="text-emerald-400" />, desc: 'Liquidity Health' },
    { label: 'Debt-to-Equity', value: health.debtToEquity.toFixed(2), icon: <ShieldAlert className="text-amber-400" />, desc: 'Solvency Risk' },
    { label: 'Monthly Burn', value: `$${(health.monthlyBurn / 1000).toFixed(1)}k`, icon: <TrendingDown className="text-rose-400" />, desc: 'OpEx Velocity' },
    { label: 'Est. Runway', value: `${health.runwayMonths.toFixed(0)} Mo`, icon: <Zap className="text-blue-400" />, desc: 'Capital Runway' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div 
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#111113] border border-white/5 p-6 rounded-3xl shadow-xl group hover:border-white/20 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-white/5">{card.icon}</div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{card.desc}</span>
          </div>
          <h4 className="text-zinc-400 text-xs font-semibold uppercase mb-1">{card.label}</h4>
          <p className="text-2xl font-display font-bold text-white">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

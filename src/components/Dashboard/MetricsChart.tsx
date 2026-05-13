import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLedgerStore } from '../../store/useLedgerStore';

export const MetricsChart: React.FC = () => {
  const { getChartData } = useLedgerStore();
  const data = getChartData();

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="w-full h-[350px] bg-[#111113] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Subtle radial glow matching the chart color */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="mb-6 flex justify-between items-end relative z-10">
        <div>
          <h3 className="text-zinc-500 text-sm font-semibold uppercase tracking-wider mb-1">Net Liquidity</h3>
          <p className="text-3xl font-display font-bold text-white tracking-tight">{formatCurrency(data[data.length - 1].balance)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="w-full h-[220px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} strokeOpacity={0.05} />
            <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis hide domain={['dataMin - 50000', 'dataMax + 50000']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

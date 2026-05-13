import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit';
export type AccountCategory = 'Operating' | 'Institutional' | 'Partner Capital' | 'Realization' | 'Cash & Bank' | 'Secretarial Compliance';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: AccountCategory;
  entity: string;
  description: string;
  date: string;
  lf?: string;
}

interface LedgerState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  
  getNetPosition: () => number;
  getFinancialHealth: () => {
    currentRatio: number;
    debtToEquity: number;
    monthlyBurn: number;
    runwayMonths: number;
  };
  getChartData: () => { date: string; balance: number; revenue: number }[];
  getTrialBalance: () => { category: string; debit: number; credit: number }[];
}

const initialData: Transaction[] = [
  { id: 'TXN-8291', amount: 850000, type: 'credit', category: 'Realization', entity: 'Asset Sale', description: 'Liquidation of Primary Assets', lf: 'R-12', date: new Date().toISOString() },
  { id: 'TXN-8292', amount: 425000, type: 'debit', category: 'Partner Capital', entity: 'Partner A', description: 'Death of a Partner - Settlement', lf: 'C-01', date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TXN-8293', amount: 45000, type: 'debit', category: 'Operating', entity: 'Payroll', description: 'Monthly Burn', lf: 'O-02', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TXN-8294', amount: 450000, type: 'credit', category: 'Institutional', entity: 'Capital Bank', description: 'Debt Facility', lf: 'I-99', date: new Date(Date.now() - 172800000).toISOString() },
  { id: 'TXN-8295', amount: 610000, type: 'debit', category: 'Cash & Bank', entity: 'Reserve Bank', description: 'Net Liquidity Retained', lf: 'B-01', date: new Date(Date.now() - 259200000).toISOString() },
];

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      transactions: initialData,

      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: `TXN-${Math.floor(Math.random() * 9000) + 1000}`, date: new Date().toISOString() }, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),

      removeTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      getNetPosition: () => get().transactions.reduce((acc, curr) => curr.type === 'credit' ? acc + curr.amount : acc - curr.amount, 0),

      getFinancialHealth: () => {
        const txs = get().transactions;
        const assets = txs.filter(t => t.category === 'Realization' || t.category === 'Cash & Bank').reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
        const debt = txs.filter(t => t.category === 'Institutional').reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc - t.amount, 0);
        const equity = txs.filter(t => t.category === 'Partner Capital').reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
        const burn = txs.filter(t => t.category === 'Operating' && t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
        
        return {
          currentRatio: debt > 0 ? assets / debt : assets,
          debtToEquity: equity > 0 ? debt / equity : debt / 1,
          monthlyBurn: burn,
          runwayMonths: burn > 0 ? assets / burn : Infinity
        };
      },

      getChartData: () => {
        let runningBalance = 400000; 
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i));
          const dailyTx = get().transactions.filter(t => new Date(t.date).toDateString() === d.toDateString());
          const dailyRev = dailyTx.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc, 0);
          const dailyExp = dailyTx.reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc, 0);
          runningBalance += (dailyRev - dailyExp);
          
          return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), balance: runningBalance, revenue: dailyRev };
        });
      },

      getTrialBalance: () => {
        const ledgers: Record<string, { debit: number; credit: number }> = {};
        get().transactions.forEach(tx => {
          if (!ledgers[tx.category]) ledgers[tx.category] = { debit: 0, credit: 0 };
          if (tx.type === 'debit') ledgers[tx.category].debit += tx.amount;
          if (tx.type === 'credit') ledgers[tx.category].credit += tx.amount;
        });

        return Object.entries(ledgers).map(([category, totals]) => {
          const net = totals.debit - totals.credit;
          return { category, debit: net > 0 ? net : 0, credit: net < 0 ? Math.abs(net) : 0 };
        });
      }
    }),
    { name: 'ledgerflow-storage-v10' }
  )
);

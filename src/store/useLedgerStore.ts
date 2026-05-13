import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit';
export type AccountCategory = 'Operating' | 'Institutional' | 'Partner Capital' | 'Realization' | 'Secretarial Compliance';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: AccountCategory;
  entity: string;
  description: string;
  date: string;
}

interface LedgerState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  
  getNetPosition: () => number;
  getCapitalAccounts: () => { name: string; value: number }[];
  getChartData: () => { date: string; balance: number; revenue: number }[];
}

const initialData: Transaction[] = [
  { id: 'TXN-8291', amount: 850000, type: 'credit', category: 'Realization', entity: 'Asset Sale', description: 'Liquidation of Primary Assets', date: new Date().toISOString() },
  { id: 'TXN-8292', amount: 425000, type: 'debit', category: 'Partner Capital', entity: 'Partner A', description: 'Death of a Partner - Capital Settlement', date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TXN-8293', amount: 15000, type: 'debit', category: 'Secretarial Compliance', entity: 'State Board', description: 'SP Audit & Registration Fees', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TXN-8294', amount: 200000, type: 'credit', category: 'Institutional', entity: 'Q4 Final Accounts', description: 'P&L Surplus Transfer', date: new Date(Date.now() - 172800000).toISOString() },
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

      getCapitalAccounts: () => {
        const breakdown = get().transactions.reduce((acc, curr) => {
          if (curr.category === 'Partner Capital' || curr.category === 'Realization') {
            acc[curr.category] = (acc[curr.category] || 0) + (curr.type === 'credit' ? curr.amount : -curr.amount);
          }
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
      },

      getChartData: () => {
        let runningBalance = 400000; 
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dailyTx = get().transactions.filter(t => new Date(t.date).toDateString() === d.toDateString());
          const dailyRev = dailyTx.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc, 0);
          const dailyExp = dailyTx.reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc, 0);
          runningBalance += (dailyRev - dailyExp);
          
          return {
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            balance: runningBalance,
            revenue: dailyRev || Math.random() * 50000 + 10000
          };
        });
      }
    }),
    { name: 'ledgerflow-storage-v6' }
  )
);

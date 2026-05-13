import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit';
export type AccountCategory = 'Operating' | 'Institutional' | 'Partner Capital' | 'Liquidation Reserve' | 'Realization';

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
  
  // Derived analytical getters
  getNetPosition: () => number;
  getCapitalAccounts: () => { name: string; value: number }[];
  getChartData: () => { date: string; balance: number; revenue: number }[];
}

const initialData: Transaction[] = [
  { id: 'TXN-001', amount: 450000, type: 'credit', category: 'Institutional', entity: 'Apex Capital Partners', description: 'Q3 Institutional Dividend Funding', date: new Date().toISOString() },
  { id: 'TXN-002', amount: 125000, type: 'debit', category: 'Liquidation Reserve', entity: 'Partner A', description: 'First Realization Distribution', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TXN-003', amount: 75000, type: 'credit', category: 'Partner Capital', entity: 'Partner B', description: 'Capital Call Injection', date: new Date(Date.now() - 172800000).toISOString() },
  { id: 'TXN-004', amount: 12000, type: 'debit', category: 'Operating', entity: 'AWS Cloud', description: 'Infrastructure Compute', date: new Date(Date.now() - 259200000).toISOString() },
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

      getNetPosition: () => {
        return get().transactions.reduce((acc, curr) => curr.type === 'credit' ? acc + curr.amount : acc - curr.amount, 0);
      },

      getCapitalAccounts: () => {
        const breakdown = get().transactions.reduce((acc, curr) => {
          if (curr.category === 'Partner Capital' || curr.category === 'Liquidation Reserve') {
            acc[curr.category] = (acc[curr.category] || 0) + (curr.type === 'credit' ? curr.amount : -curr.amount);
          }
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
      },

      getChartData: () => {
        // Generate a beautifully smoothed 7-day trailing chart based on transactions
        let runningBalance = 250000; // Base historical
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
            revenue: dailyRev || Math.random() * 50000 + 10000 // Mock data for empty days to keep chart pretty
          };
        });
      }
    }),
    { name: 'ledgerflow-storage' }
  )
);

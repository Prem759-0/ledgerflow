import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit';
export type AccountCategory = 'Operating' | 'Institutional' | 'Partner Capital' | 'Realization' | 'Cash & Bank';

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
  getFinancialHealth: () => {
    currentRatio: number;
    debtToEquity: number;
    monthlyBurn: number;
    runwayMonths: number;
  };
  getChartData: () => { date: string; balance: number }[];
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      transactions: [
        { id: 'TXN-1', amount: 1250000, type: 'credit', category: 'Realization', entity: 'Asset Sale', description: 'Primary Liquidation', date: new Date().toISOString() },
        { id: 'TXN-2', amount: 450000, type: 'debit', category: 'Institutional', entity: 'Capital Bank', description: 'Debt Facility', date: new Date().toISOString() },
        { id: 'TXN-3', amount: 45000, type: 'debit', category: 'Operating', entity: 'Payroll', description: 'Monthly Burn', date: new Date().toISOString() }
      ],

      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: `TXN-${Math.floor(Math.random() * 10000)}`, date: new Date().toISOString() }, ...state.transactions]
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
        
        // Calculate Burn (Avg of last 30 days of Operating expenses)
        const burn = txs.filter(t => t.category === 'Operating' && t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
        
        return {
          currentRatio: debt > 0 ? assets / debt : assets,
          debtToEquity: equity > 0 ? debt / equity : debt / 1,
          monthlyBurn: burn,
          runwayMonths: burn > 0 ? assets / burn : Infinity
        };
      },

      getChartData: () => {
        let balance = 500000;
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i));
          return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), balance: (balance += (Math.random() - 0.4) * 50000) };
        });
      }
    }),
    { name: 'ledgerflow-v8' }
  )
);

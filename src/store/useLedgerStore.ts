import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit';
export type AccountCategory = 'Operating' | 'Institutional' | 'Partner Capital' | 'Realization' | 'Secretarial Compliance' | 'Cash & Bank';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: AccountCategory;
  entity: string;
  description: string;
  date: string;
  lf?: string; // Ledger Folio reference
}

interface LedgerState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  
  getNetPosition: () => number;
  getChartData: () => { date: string; balance: number; revenue: number }[];
  getTrialBalance: () => { category: string; debit: number; credit: number }[];
}

const initialData: Transaction[] = [
  { id: 'TXN-8291', amount: 850000, type: 'credit', category: 'Realization', entity: 'Asset Sale', description: 'Liquidation of Primary Assets', lf: 'R-12', date: new Date().toISOString() },
  { id: 'TXN-8292', amount: 425000, type: 'debit', category: 'Partner Capital', entity: 'Partner A', description: 'Capital Settlement', lf: 'C-01', date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TXN-8293', amount: 15000, type: 'debit', category: 'Secretarial Compliance', entity: 'State Board', description: 'Audit & Registration Fees', lf: 'S-04', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TXN-8294', amount: 200000, type: 'credit', category: 'Institutional', entity: 'Q4 Final Accounts', description: 'P&L Surplus Transfer', lf: 'I-99', date: new Date(Date.now() - 172800000).toISOString() },
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

      getChartData: () => {
        let runningBalance = 400000; 
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dailyTx = get().transactions.filter(t => new Date(t.date).toDateString() === d.toDateString());
          const dailyRev = dailyTx.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc, 0);
          const dailyExp = dailyTx.reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc, 0);
          runningBalance += (dailyRev - dailyExp);
          
          return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), balance: runningBalance, revenue: dailyRev };
        });
      },

      getTrialBalance: () => {
        // Advanced Accounting Engine: Aggregates all ledgers into a balanced view
        const ledgers: Record<string, { debit: number; credit: number }> = {};
        
        get().transactions.forEach(tx => {
          if (!ledgers[tx.category]) ledgers[tx.category] = { debit: 0, credit: 0 };
          if (tx.type === 'debit') ledgers[tx.category].debit += tx.amount;
          if (tx.type === 'credit') ledgers[tx.category].credit += tx.amount;
        });

        // Calculate net balances for the Trial Balance
        return Object.entries(ledgers).map(([category, totals]) => {
          const net = totals.debit - totals.credit;
          return {
            category,
            debit: net > 0 ? net : 0,
            credit: net < 0 ? Math.abs(net) : 0
          };
        });
      }
    }),
    { name: 'ledgerflow-storage-v7' }
  )
);

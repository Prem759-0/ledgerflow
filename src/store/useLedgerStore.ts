import { create } from 'zustand';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountCategory = 'Personal' | 'Institutional' | 'Partnership Liquidation' | 'Capital Account';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: AccountCategory;
  description: string;
  date: string;
}

interface LedgerState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  
  // Derived analytical getters
  getTotalBalance: () => number;
  getIncomeExpense: () => { income: number; expense: number };
  getCategoryBreakdown: () => { name: string; value: number }[];
}

// Initial mock data to show off the advanced accounting features
const initialData: Transaction[] = [
  { id: '1', amount: 125000, type: 'income', category: 'Institutional', description: 'Q3 Institutional Dividend', date: new Date().toISOString() },
  { id: '2', amount: 45000, type: 'expense', category: 'Partnership Liquidation', description: 'Partner A Capital Return', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', amount: 3200, type: 'expense', category: 'Personal', description: 'Workstation Setup', date: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', amount: 15000, type: 'income', category: 'Capital Account', description: 'Capital Injection', date: new Date(Date.now() - 259200000).toISOString() },
];

export const useLedgerStore = create<LedgerState>((set, get) => ({
  transactions: initialData,

  addTransaction: (tx) => set((state) => ({
    transactions: [{ ...tx, id: crypto.randomUUID() }, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })),

  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),

  getTotalBalance: () => {
    return get().transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  },

  getIncomeExpense: () => {
    return get().transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.income += curr.amount;
      if (curr.type === 'expense') acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });
  },

  getCategoryBreakdown: () => {
    const expenses = get().transactions.filter(t => t.type === 'expense');
    const breakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }
}));

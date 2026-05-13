import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status; 
  priority: Priority;
  createdAt: number;
}

interface OrbitState {
  tasks: Task[];
  isCommandPaletteOpen: boolean;
  searchQuery: string;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (id: string, newStatus: Status) => void;
  deleteTask: (id: string) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const initialTasks: Task[] = [
  { id: 'TSK-1', title: 'Design System Update', description: 'Update glassmorphism variables.', status: 'in-progress', priority: 'high', createdAt: Date.now() },
  { id: 'TSK-2', title: 'Vercel Deployment', description: 'Fix strict TypeScript errors.', status: 'done', priority: 'urgent', createdAt: Date.now() - 86400000 },
  { id: 'TSK-3', title: 'Implement Command Palette', description: 'Add Cmd+K support for global search.', status: 'todo', priority: 'medium', createdAt: Date.now() },
];

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      isCommandPaletteOpen: false,
      searchQuery: '',

      addTask: (task) => set((state) => ({
        tasks: [{ ...task, id: `TSK-${Math.floor(Math.random() * 1000)}`, createdAt: Date.now() }, ...state.tasks]
      })),

      updateTaskStatus: (id, newStatus) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
      setSearchQuery: (query) => set({ searchQuery: query })
    }),
    { name: 'orbit-os-storage' } // Persists to LocalStorage automatically!
  )
);

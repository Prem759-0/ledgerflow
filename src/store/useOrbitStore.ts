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
  labels: string[];
  assignee: string | null;
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
  { id: 'ORB-142', title: 'Implement Command Palette', description: 'Add Cmd+K support for global search and actions.', status: 'in-progress', priority: 'high', labels: ['Feature', 'Frontend'], assignee: 'Me', createdAt: Date.now() },
  { id: 'ORB-089', title: 'Fix Vercel Deployment Errors', description: 'Resolve strict TypeScript interface imports.', status: 'done', priority: 'urgent', labels: ['Bug'], assignee: 'Me', createdAt: Date.now() - 86400000 },
  { id: 'ORB-156', title: 'Design System Update', description: 'Refine glassmorphism variables to match Linear.', status: 'todo', priority: 'medium', labels: ['Design'], assignee: null, createdAt: Date.now() },
];

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      isCommandPaletteOpen: false,
      searchQuery: '',

      addTask: (task) => set((state) => ({
        tasks: [{ ...task, id: `ORB-${Math.floor(Math.random() * 900) + 100}`, createdAt: Date.now() }, ...state.tasks]
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
    { name: 'orbit-os-storage' }
  )
);

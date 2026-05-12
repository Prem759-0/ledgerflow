import { create } from 'zustand';

export type NoteColor = 'yellow' | 'blue' | 'pink' | 'green';

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: NoteColor;
  zIndex: number;
}

export interface CursorPos {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface BoardState {
  notes: Record<string, StickyNote>;
  cursors: Record<string, CursorPos>;
  zoom: number;
  pan: { x: number; y: number };
  activeTool: 'select' | 'hand' | 'note';
  myCursorId: string;
  myCursorColor: string;
  maxZIndex: number;

  setTool: (tool: 'select' | 'hand' | 'note') => void;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((p: { x: number; y: number }) => { x: number; y: number })) => void;
  
  addNote: (x: number, y: number, color: NoteColor) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  bringToFront: (id: string) => void;
  
  updateCursor: (x: number, y: number) => void;
  removeCursor: (id: string) => void;

  // Sync methods
  syncState: (state: Partial<BoardState>) => void;
}

// Generate unique ID and color for this specific browser tab instance
const MY_ID = crypto.randomUUID();
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const MY_COLOR = COLORS[Math.floor(Math.random() * COLORS.length)];

// Initialize the BroadcastChannel for cross-tab syncing
const channel = new BroadcastChannel('syncboard_room');

export const useBoardStore = create<BoardState>((set, get) => {
  
  // Listen for messages from other tabs
  channel.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === 'SYNC_STATE') {
      get().syncState(payload);
    } else if (type === 'CURSOR_MOVE') {
      set(state => ({ cursors: { ...state.cursors, [payload.id]: payload } }));
    }
  };

  const broadcastState = (updates: Partial<BoardState>) => {
    channel.postMessage({ type: 'SYNC_STATE', payload: updates });
  };

  return {
    notes: {},
    cursors: {},
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeTool: 'select',
    myCursorId: MY_ID,
    myCursorColor: MY_COLOR,
    maxZIndex: 1,

    syncState: (updates) => set((state) => ({ ...state, ...updates })),

    setTool: (tool) => set({ activeTool: tool }),
    
    setZoom: (zoom) => set((state) => {
      const newZoom = typeof zoom === 'function' ? zoom(state.zoom) : zoom;
      return { zoom: newZoom };
    }),
    
    setPan: (pan) => set((state) => {
      const newPan = typeof pan === 'function' ? pan(state.pan) : pan;
      return { pan: newPan };
    }),

    addNote: (x, y, color) => set((state) => {
      const id = crypto.randomUUID();
      const newZ = state.maxZIndex + 1;
      const newNotes = { ...state.notes, [id]: { id, x, y, text: '', color, zIndex: newZ } };
      broadcastState({ notes: newNotes, maxZIndex: newZ });
      return { notes: newNotes, maxZIndex: newZ };
    }),

    updateNote: (id, updates) => set((state) => {
      const newNotes = { ...state.notes, [id]: { ...state.notes[id], ...updates } };
      broadcastState({ notes: newNotes });
      return { notes: newNotes };
    }),

    deleteNote: (id) => set((state) => {
      const newNotes = { ...state.notes };
      delete newNotes[id];
      broadcastState({ notes: newNotes });
      return { notes: newNotes };
    }),

    bringToFront: (id) => set((state) => {
      const newZ = state.maxZIndex + 1;
      const newNotes = { ...state.notes, [id]: { ...state.notes[id], zIndex: newZ } };
      broadcastState({ notes: newNotes, maxZIndex: newZ });
      return { notes: newNotes, maxZIndex: newZ };
    }),

    updateCursor: (x, y) => {
      channel.postMessage({ 
        type: 'CURSOR_MOVE', 
        payload: { id: MY_ID, x, y, color: MY_COLOR, name: `User ${MY_ID.substring(0,4)}` } 
      });
    },

    removeCursor: (id) => set((state) => {
      const newCursors = { ...state.cursors };
      delete newCursors[id];
      return { cursors: newCursors };
    })
  };
});

// Cleanup when tab closes
window.addEventListener('beforeunload', () => {
  channel.postMessage({ type: 'CURSOR_REMOVE', payload: MY_ID });
  channel.close();
});

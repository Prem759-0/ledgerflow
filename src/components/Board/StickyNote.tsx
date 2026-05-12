import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBoardStore, StickyNote as StickyNoteType } from '../../store/useBoardStore';
import { Trash2 } from 'lucide-react';

interface Props {
  note: StickyNoteType;
}

const colorMap = {
  yellow: 'bg-yellow-200 text-yellow-900 border-yellow-300 shadow-yellow-500/20',
  blue: 'bg-blue-200 text-blue-900 border-blue-300 shadow-blue-500/20',
  pink: 'bg-pink-200 text-pink-900 border-pink-300 shadow-pink-500/20',
  green: 'bg-emerald-200 text-emerald-900 border-emerald-300 shadow-emerald-500/20',
};

export const StickyNote: React.FC<Props> = ({ note }) => {
  const { updateNote, deleteNote, bringToFront, activeTool } = useBoardStore();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [note.text]);

  const handleDragEnd = (_: any, info: any) => {
    updateNote(note.id, { 
      x: note.x + info.offset.x, 
      y: note.y + info.offset.y 
    });
  };

  const isDraggable = activeTool === 'select';

  return (
    <motion.div
      drag={isDraggable}
      dragMomentum={false}
      onDragStart={() => bringToFront(note.id)}
      onDragEnd={handleDragEnd}
      initial={{ x: note.x, y: note.y, scale: 0, opacity: 0 }}
      animate={{ x: note.x, y: note.y, scale: 1, opacity: 1, zIndex: note.zIndex }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={isDraggable ? { scale: 1.02 } : {}}
      whileDrag={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      className={`absolute w-56 p-4 rounded-xl border shadow-xl flex flex-col gap-2 group ${colorMap[note.color]} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      onPointerDown={(e) => {
        if (!isDraggable) e.stopPropagation();
        bringToFront(note.id);
      }}
    >
      <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-3 rounded-full bg-black/10 cursor-grab active:cursor-grabbing" />
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
          className="p-1.5 rounded-md hover:bg-black/10 text-black/50 hover:text-black/80 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={textAreaRef}
        value={note.text}
        onChange={(e) => updateNote(note.id, { text: e.target.value })}
        placeholder="Type something..."
        className="w-full bg-transparent border-none outline-none resize-none font-medium placeholder:text-black/30 overflow-hidden leading-relaxed"
        rows={3}
        onPointerDown={(e) => e.stopPropagation()} // Let user click text to type without dragging
      />
    </motion.div>
  );
};

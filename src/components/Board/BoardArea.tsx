import React, { useRef, useState } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { StickyNote } from './StickyNote';
import { motion, AnimatePresence } from 'framer-motion';

export const BoardArea: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  
  const { 
    notes, cursors, zoom, setZoom, pan, setPan, 
    activeTool, addNote, updateCursor, myCursorId 
  } = useBoardStore();

  // Convert screen coordinates to board coordinates
  const getBoardCoords = (e: React.PointerEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'hand' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (activeTool === 'note') {
      const coords = getBoardCoords(e);
      const colors: ('yellow'|'blue'|'pink'|'green')[] = ['yellow', 'blue', 'pink', 'green'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addNote(coords.x - 100, coords.y - 100, randomColor); // Offset so note spawns centered on mouse
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Multiplayer Cursor Sync
    const coords = getBoardCoords(e);
    updateCursor(coords.x, coords.y);

    if (isPanning) {
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.min(Math.max(0.1, prev * zoomFactor), 3));
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`w-full h-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${activeTool === 'hand' || isPanning ? 'cursor-grab active:cursor-grabbing' : activeTool === 'note' ? 'cursor-crosshair' : 'cursor-default'}`}
    >
      {/* Infinite Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40 transition-transform duration-75"
        style={{
          backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
          backgroundImage: `radial-gradient(circle at ${1 * zoom}px ${1 * zoom}px, currentColor ${1 * zoom}px, transparent 0)`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Spatial Layer */}
      <div 
        className="absolute inset-0 origin-top-left transition-transform duration-75 will-change-transform"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {/* Render Notes */}
        {Object.values(notes).map(note => (
          <StickyNote key={note.id} note={note} />
        ))}

        {/* Render Multiplayer Cursors */}
        <AnimatePresence>
          {Object.values(cursors).map(cursor => {
            if (cursor.id === myCursorId) return null; // Don't render our own cursor
            return (
              <motion.div
                key={cursor.id}
                initial={{ opacity: 0 }}
                animate={{ x: cursor.x, y: cursor.y, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
                className="absolute top-0 left-0 pointer-events-none z-[9999] flex flex-col items-center drop-shadow-md"
              >
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="origin-top-left -rotate-12">
                  <path d="M5.65376 2.15376C5.40125 1.56535 4.59875 1.56535 4.34624 2.15376L0.26477 11.6766C0.00760431 12.2766 0.448555 12.9328 1.09641 12.9328H3.84473C4.12087 12.9328 4.34473 13.1567 4.34473 13.4328V18.1706C4.34473 18.7229 4.79245 19.1706 5.34473 19.1706H6.65527C7.20756 19.1706 7.65527 18.7229 7.65527 18.1706V13.4328C7.65527 13.1567 7.87914 12.9328 8.15527 12.9328H10.9036C11.5514 12.9328 11.9924 12.2766 11.7352 11.6766L5.65376 2.15376Z" fill={cursor.color} stroke="white" strokeWidth="1.5"/>
                </svg>
                <div 
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap ml-4 -mt-2"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

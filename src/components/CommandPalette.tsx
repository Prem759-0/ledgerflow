import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrbitStore, Task, Status } from '../store/useOrbitStore';
import { MoreHorizontal, Plus, AlertCircle, CheckCircle2, Circle, Clock } from 'lucide-react';

const COLUMNS: { id: Status; title: string; icon: React.ReactNode }[] = [
  { id: 'backlog', title: 'Backlog', icon: <Clock className="w-4 h-4 text-zinc-500" /> },
  { id: 'todo', title: 'To Do', icon: <Circle className="w-4 h-4 text-zinc-400" /> },
  { id: 'in-progress', title: 'In Progress', icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
  { id: 'done', title: 'Done', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
];

export const KanbanBoard: React.FC = () => {
  const { tasks, updateTaskStatus } = useOrbitStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex gap-6 no-scrollbar items-start h-full">
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-80 h-full flex flex-col gap-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-4"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-semibold text-zinc-200 text-sm">{col.title}</h3>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-[150px]">
              {columnTasks.map(task => (
                <motion.div
                  layout
                  layoutId={task.id}
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, task.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                  key={task.id}
                  className={`bg-zinc-800/80 border border-zinc-700/50 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors shadow-sm ${draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-zinc-400 font-medium">{task.id}</span>
                    <button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1 leading-tight">{task.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                      ME
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      task.priority === 'urgent' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                      task.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                      'bg-zinc-700/50 border-zinc-600 text-zinc-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

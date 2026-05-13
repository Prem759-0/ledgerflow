import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrbitStore, Status } from '../store/useOrbitStore';
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

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, status);
    setDraggedTaskId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex gap-6 no-scrollbar items-start h-full">
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <div 
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-[320px] h-full flex flex-col gap-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 p-3"
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-semibold text-zinc-200 text-sm tracking-tight">{col.title}</h3>
                <span className="text-xs font-mono text-zinc-500">{columnTasks.length}</span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 hover:bg-zinc-800 rounded-md"><Plus className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-[150px] pb-4">
              {columnTasks.map(task => (
                <motion.div
                  layout
                  layoutId={task.id}
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, task.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                  key={task.id}
                  className={`bg-[#222224] border border-zinc-700/60 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-zinc-500/80 transition-colors shadow-sm flex flex-col gap-3 ${draggedTaskId === task.id ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono text-zinc-400 font-medium">{task.id}</span>
                    <button className="text-zinc-500 hover:text-zinc-300 opacity-0 hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                  
                  <h4 className="text-sm font-medium text-zinc-100 leading-snug">{task.title}</h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map(label => (
                      <span key={label} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {label}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                        task.priority === 'urgent' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                        task.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                        'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.assignee ? (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white shadow-inner ring-2 ring-[#222224]">
                        {task.assignee.substring(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-dashed border-zinc-600 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-zinc-600" />
                      </div>
                    )}
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

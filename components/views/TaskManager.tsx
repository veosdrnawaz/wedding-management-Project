import React, { useState } from 'react';
import { AppData, Language, Task } from '@/types';
import { Trash2, CheckSquare, Square, User, Plus } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  lang: Language;
}

export const TaskManager: React.FC<Props> = ({ data, setData, lang }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      priority: newTaskPriority,
      assignedTo: newTaskAssignee || 'Unassigned',
      completed: false
    };

    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    setNewTaskName('');
    setNewTaskAssignee('');
  };

  const toggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const pendingTasks = data.tasks.filter(t => !t.completed);
  const completedTasks = data.tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className={`text-xl font-bold mb-4 ${lang === 'ur' ? 'font-urdu' : ''}`}>
             {lang === 'en' ? 'Add New Task' : 'نیا کام شامل کریں'}
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
            <input 
                type="text" 
                placeholder={lang === 'en' ? "Task description..." : "کام کی تفصیل..."}
                className="flex-1 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <input 
                type="text" 
                placeholder={lang === 'en' ? "Assign to (e.g. Brother)" : "کس کے ذمہ ہے؟"}
                className="md:w-48 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20"
                value={newTaskAssignee}
                onChange={e => setNewTaskAssignee(e.target.value)}
            />
            <select 
                className="md:w-36 border border-slate-300 p-3 rounded-xl bg-white"
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as any)}
            >
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low Priority</option>
            </select>
            <button 
                onClick={handleAddTask}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                {lang === 'en' ? 'Add' : 'شامل کریں'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-hidden min-h-[400px]">
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-amber-50 p-5 border-b border-amber-100 flex justify-between items-center">
                <h3 className={`font-bold text-amber-900 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {lang === 'en' ? 'Pending Tasks' : 'باقی کام'}
                </h3>
                <span className="bg-white text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold">{pendingTasks.length}</span>
            </div>
            <div className="overflow-auto flex-1 p-4 space-y-3 custom-scrollbar">
                {pendingTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-start gap-4 group">
                        <button onClick={() => toggleTask(task.id)} className="mt-1 text-slate-300 hover:text-green-500 transition-colors">
                            <Square className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <p className="text-slate-800 font-medium leading-relaxed">{task.name}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${
                                    task.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 
                                    task.priority === 'Medium' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                    {task.priority}
                                </span>
                                {task.assignedTo !== 'Unassigned' && (
                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                        <User className="w-3 h-3" /> {task.assignedTo}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {pendingTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <CheckSquare className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">No pending tasks. Great job!</p>
                    </div>
                )}
            </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className={`font-bold text-slate-700 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                    {lang === 'en' ? 'Completed Tasks' : 'مکمل شدہ کام'}
                </h3>
                <span className="bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold">{completedTasks.length}</span>
            </div>
            <div className="overflow-auto flex-1 p-4 space-y-3 custom-scrollbar">
                {completedTasks.map(task => (
                    <div key={task.id} className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl flex items-start gap-4 opacity-75 hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleTask(task.id)} className="mt-1 text-green-500">
                            <CheckSquare className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <p className="text-slate-500 line-through decoration-slate-400">{task.name}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {task.assignedTo}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
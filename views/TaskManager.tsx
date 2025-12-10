import React, { useState } from 'react';
import { AppData, Language, Task } from '../types';
import { Plus, Trash2, CheckSquare, Square, User } from 'lucide-react';

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
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className={`text-xl font-bold mb-4 ${lang === 'ur' ? 'font-urdu' : ''}`}>
             {lang === 'en' ? 'Add New Task' : 'نیا کام شامل کریں'}
        </h2>
        <div className="flex flex-col md:flex-row gap-2">
            <input 
                type="text" 
                placeholder={lang === 'en' ? "Task description..." : "کام کی تفصیل..."}
                className="flex-1 border p-2 rounded-lg"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <input 
                type="text" 
                placeholder={lang === 'en' ? "Assign to (e.g. Brother)" : "کس کے ذمہ ہے؟"}
                className="md:w-48 border p-2 rounded-lg"
                value={newTaskAssignee}
                onChange={e => setNewTaskAssignee(e.target.value)}
            />
            <select 
                className="md:w-32 border p-2 rounded-lg"
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as any)}
            >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <button 
                onClick={handleAddTask}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90"
            >
                {lang === 'en' ? 'Add' : 'شامل کریں'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                <h3 className={`font-bold text-amber-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    {lang === 'en' ? 'Pending Tasks' : 'باقی کام'}
                </h3>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">{pendingTasks.length}</span>
            </div>
            <div className="overflow-auto flex-1 p-2 space-y-2">
                {pendingTasks.map(task => (
                    <div key={task.id} className="bg-white p-3 border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all flex items-start gap-3 group">
                        <button onClick={() => toggleTask(task.id)} className="mt-1 text-slate-400 hover:text-green-500">
                            <Square className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <p className="text-slate-800 font-medium">{task.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                <span className={`flex items-center gap-1 ${
                                    task.priority === 'High' ? 'text-red-600 font-bold' : 
                                    task.priority === 'Medium' ? 'text-orange-600' : 'text-slate-500'
                                }`}>
                                    {task.priority} Priority
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {task.assignedTo}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {pendingTasks.length === 0 && (
                    <p className="text-center text-slate-400 py-8 text-sm">No pending tasks. Great job!</p>
                )}
            </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden opacity-80">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className={`font-bold text-slate-700 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    {lang === 'en' ? 'Completed Tasks' : 'مکمل شدہ کام'}
                </h3>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{completedTasks.length}</span>
            </div>
            <div className="overflow-auto flex-1 p-2 space-y-2">
                {completedTasks.map(task => (
                    <div key={task.id} className="bg-slate-50 p-3 border border-slate-100 rounded-lg flex items-start gap-3">
                        <button onClick={() => toggleTask(task.id)} className="mt-1 text-green-500">
                            <CheckSquare className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <p className="text-slate-500 line-through decoration-slate-400">{task.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {task.assignedTo}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500">
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
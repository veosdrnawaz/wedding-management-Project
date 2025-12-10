import React, { useEffect, useState } from 'react';
import { AppData, Language, Task } from '@/types';
import { analyzeBudget } from '@/services/geminiService';
import { Users, DollarSign, CheckSquare, Calendar, Gift, AlertTriangle, Wallet, ArrowRight, TrendingUp } from 'lucide-react';

interface Props {
  data: AppData;
  lang: Language;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<Props> = ({ data, lang, onNavigate }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (data.events.length > 0 || data.guests.length > 0) {
      setLoadingAi(true);
      analyzeBudget(data).then(res => {
        setAiAnalysis(res);
        setLoadingAi(false);
      });
    }
  }, [data.events.length, data.guests.length, data.vendors.length]);

  const totalSalami = data.gifts ? data.gifts.reduce((sum, g) => sum + (g.type === 'Salami' || g.type === 'Nyoondrah' ? g.amount : 0), 0) : 0;
  
  const totalVendorCost = data.vendors.reduce((acc, v) => acc + v.cost, 0);
  const totalPaid = data.vendors.reduce((acc, v) => acc + v.paidAmount, 0);
  const totalOutstanding = totalVendorCost - totalPaid;

  const pendingTasks = data.tasks.filter(t => !t.completed);
  
  const tasksByAssignee = pendingTasks.reduce((acc, task) => {
    if (!acc[task.assignedTo]) acc[task.assignedTo] = [];
    acc[task.assignedTo].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const stats = [
    { 
      title: lang === 'en' ? 'Total Guests' : 'کل مہمان', 
      value: data.guests.length, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      link: 'guests'
    },
    { 
      title: lang === 'en' ? 'Salami Collected' : 'سلامی/نیوندرا', 
      value: `Rs ${totalSalami.toLocaleString()}`, 
      icon: Gift, 
      color: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-600',
      link: 'gifts'
    },
    { 
      title: lang === 'en' ? 'Events Planned' : 'تقریبات', 
      value: data.events.length, 
      icon: Calendar, 
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      link: 'events'
    },
    { 
      title: lang === 'en' ? 'Pending Tasks' : 'باقی کام', 
      value: pendingTasks.length, 
      icon: CheckSquare, 
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      link: 'tasks'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-violet-800 text-white p-8 rounded-2xl shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {lang === 'en' ? 'Wedding Dashboard' : 'شادی ڈیش بورڈ'}
            </h2>
            <p className="text-white/80 mt-2 max-w-xl text-sm leading-relaxed">
              {lang === 'en' ? 'Welcome to your complete wedding planner. Track events, manage guests, and oversee your budget all in one place.' : 'آپ کے شادی کے منصوبہ ساز میں خوش آمدید۔ تقریبات، مہمانوں اور بجٹ کا ایک ہی جگہ انتظام کریں۔'}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('guide')}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2.5 rounded-xl font-medium hover:bg-white hover:text-primary transition-all shadow-lg active:scale-95"
          >
            {lang === 'en' ? 'Open Guide' : 'گائیڈ کھولیں'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(stat.link)}
            className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border ${stat.border} hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-left w-full`}
          >
            <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
              <stat.icon className={`w-8 h-8 ${stat.text}`} />
            </div>
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-gray-200 mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className={`text-sm text-slate-500 font-medium mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className={`text-lg font-bold text-slate-800 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                <Wallet className="w-5 h-5 text-slate-500" />
                {lang === 'en' ? 'Financial Overview' : 'مالیاتی جائزہ'}
              </h3>
              <button onClick={() => onNavigate('vendors')} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                {lang === 'en' ? 'View Details' : 'تفصیلات دیکھیں'} <ArrowRight className="w-4 h-4" />
              </button>
           </div>
           
           <div className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Cost</p>
                   <p className="text-2xl font-bold text-slate-800">Rs {totalVendorCost.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-xl border border-green-100 bg-green-50/50">
                   <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Paid</p>
                   <p className="text-2xl font-bold text-green-700">Rs {totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-xl border border-red-100 bg-red-50/50">
                   <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Outstanding</p>
                   <p className="text-2xl font-bold text-red-700">Rs {totalOutstanding.toLocaleString()}</p>
                </div>
             </div>

             <div className="overflow-hidden rounded-xl border border-slate-200">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                      <tr>
                          <th className="p-4">Service</th>
                          <th className="p-4 text-right">Cost</th>
                          <th className="p-4 text-right">Paid</th>
                          <th className="p-4 text-right">Due</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                      {data.vendors.length === 0 ? (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-400">No vendors recorded.</td></tr>
                      ) : (
                          data.vendors.slice(0, 5).map(v => (
                              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-4 font-medium text-slate-700">{v.name} <span className="text-slate-400 font-normal text-xs ml-1">({v.serviceType})</span></td>
                                  <td className="p-4 text-right font-mono text-slate-600">{v.cost.toLocaleString()}</td>
                                  <td className="p-4 text-right font-mono text-green-600">{v.paidAmount.toLocaleString()}</td>
                                  <td className="p-4 text-right font-mono text-red-600 font-medium">{(v.cost - v.paidAmount).toLocaleString()}</td>
                              </tr>
                          ))
                      )}
                  </tbody>
               </table>
             </div>
           </div>
        </div>

        {/* Task Responsibility */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className={`text-lg font-bold text-slate-800 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
              <CheckSquare className="w-5 h-5 text-slate-500" />
              {lang === 'en' ? 'Task Ownership' : 'ذمہ داریاں'}
             </h3>
             <button onClick={() => onNavigate('tasks')} className="text-sm font-medium text-primary hover:underline">
                {lang === 'en' ? 'All Tasks' : 'تمام کام'}
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             {Object.keys(tasksByAssignee).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                   <div className="p-4 bg-slate-50 rounded-full mb-3">
                     <CheckSquare className="w-8 h-8 opacity-40" />
                   </div>
                   <p className="text-sm">All tasks completed!</p>
                </div>
             ) : (
                Object.entries(tasksByAssignee).map(([person, tasks], idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {person.charAt(0).toUpperCase()}
                             </div>
                             <span className="font-semibold text-slate-700 text-sm">{person}</span>
                        </div>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold">
                            {tasks.length}
                        </span>
                    </div>
                    <div className="p-2">
                        <ul className="space-y-1">
                            {tasks.map(t => (
                                <li key={t.id} className="text-xs text-slate-600 p-2 hover:bg-slate-50 rounded-lg flex items-start gap-2 transition-colors">
                                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                                        t.priority === 'High' ? 'bg-red-500 shadow-red-200 shadow-sm' : 'bg-amber-400 shadow-amber-200 shadow-sm'
                                    }`} />
                                    <span className="leading-relaxed">{t.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-32 h-32 text-indigo-900" />
        </div>
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
            <span className="text-xl">✨</span> AI Budget & Event Analysis
        </h3>
        {loadingAi ? (
            <div className="flex items-center gap-3 text-indigo-700 p-4">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium">Consulting Gemini AI...</p>
            </div>
        ) : (
            <div className="prose prose-sm prose-indigo text-slate-700 max-w-none bg-white/50 p-4 rounded-xl border border-indigo-50 relative z-10">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{aiAnalysis}</pre>
            </div>
        )}
      </div>
    </div>
  );
};
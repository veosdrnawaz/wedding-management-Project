
import React, { useEffect, useState } from 'react';
import { AppData, Language, Task } from '../types';
import { analyzeBudget } from '../services/geminiService';
import { Users, DollarSign, CheckSquare, Calendar, Gift, AlertTriangle, TrendingUp, Wallet, ArrowRight } from 'lucide-react';

interface Props {
  data: AppData;
  lang: Language;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<Props> = ({ data, lang, onNavigate }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // Only fetch AI analysis if we have data
    if (data.events.length > 0 || data.guests.length > 0) {
      setLoadingAi(true);
      analyzeBudget(data).then(res => {
        setAiAnalysis(res);
        setLoadingAi(false);
      });
    }
  }, [data.events.length, data.guests.length, data.vendors.length]);

  const totalSalami = data.gifts ? data.gifts.reduce((sum, g) => sum + (g.type === 'Salami' || g.type === 'Nyoondrah' ? g.amount : 0), 0) : 0;
  
  // Financial Calculations
  const totalVendorCost = data.vendors.reduce((acc, v) => acc + v.cost, 0);
  const totalPaid = data.vendors.reduce((acc, v) => acc + v.paidAmount, 0);
  const totalOutstanding = totalVendorCost - totalPaid;

  // Task Calculations
  const pendingTasks = data.tasks.filter(t => !t.completed);
  
  // Group tasks by assignee for detailed view
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
      color: 'bg-blue-100 text-blue-600',
      link: 'guests'
    },
    { 
      title: lang === 'en' ? 'Salami Collected' : 'سلامی/نیوندرا', 
      value: `Rs ${totalSalami.toLocaleString()}`, 
      icon: Gift, 
      color: 'bg-pink-100 text-pink-600',
      link: 'gifts'
    },
    { 
      title: lang === 'en' ? 'Events Planned' : 'تقریبات', 
      value: data.events.length, 
      icon: Calendar, 
      color: 'bg-purple-100 text-purple-600',
      link: 'events'
    },
    { 
      title: lang === 'en' ? 'Pending Tasks' : 'باقی کام', 
      value: pendingTasks.length, 
      icon: CheckSquare, 
      color: 'bg-amber-100 text-amber-600',
      link: 'tasks'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-primary to-purple-800 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className={`text-xl font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Wedding Dashboard' : 'شادی ڈیش بورڈ'}
          </h2>
          <p className="text-white/80 mt-1">
            {lang === 'en' ? 'Overview of Mangni, Mehndi, Barat & Walima.' : 'منگنی، مہندی، بارات اور ولیمہ کا جائزہ۔'}
          </p>
        </div>
        <button 
          onClick={() => onNavigate('guide')}
          className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors shadow-sm text-sm"
        >
          {lang === 'en' ? 'Open Guide' : 'گائیڈ کھولیں'}
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(stat.link)}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer text-left w-full group"
          >
            <div>
              <p className={`text-sm text-slate-500 mb-1 group-hover:text-primary transition-colors ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} group-hover:bg-primary group-hover:text-white transition-colors`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial & Vendor Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {lang === 'en' ? 'Vendor Payments & Outstanding' : 'ادائیگیاں اور بقایا جات'}
              </h3>
              <button onClick={() => onNavigate('vendors')} className="text-sm text-primary hover:underline flex items-center gap-1">
                {lang === 'en' ? 'Manage' : 'انتظام کریں'} <ArrowRight className="w-3 h-3" />
              </button>
           </div>
           
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                 <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Total Cost</span>
                 </div>
                 <p className="text-xl font-bold text-slate-800">Rs {totalVendorCost.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                 <div className="flex items-center gap-2 mb-1 text-green-700">
                    <Wallet className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Paid Amount</span>
                 </div>
                 <p className="text-xl font-bold text-green-700">Rs {totalPaid.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                 <div className="flex items-center gap-2 mb-1 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Outstanding</span>
                 </div>
                 <p className="text-xl font-bold text-red-700">Rs {totalOutstanding.toLocaleString()}</p>
              </div>
           </div>

           {/* Detailed Ledger List */}
           <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="p-3">Service / Vendor</th>
                        <th className="p-3">Cost</th>
                        <th className="p-3 text-green-600">Paid</th>
                        <th className="p-3 text-red-600">Outstanding</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.vendors.length === 0 ? (
                        <tr><td colSpan={4} className="p-4 text-center text-slate-400">No vendors added yet.</td></tr>
                    ) : (
                        data.vendors.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50">
                                <td className="p-3">
                                    <p className="font-medium text-slate-800">{v.name}</p>
                                    <p className="text-xs text-slate-500">{v.serviceType}</p>
                                </td>
                                <td className="p-3 font-mono text-slate-600">{v.cost.toLocaleString()}</td>
                                <td className="p-3 font-mono text-green-600 font-medium">{v.paidAmount.toLocaleString()}</td>
                                <td className="p-3 font-mono text-red-600 font-bold">{(v.cost - v.paidAmount).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>
           </div>
        </div>

        {/* Task Responsibility Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-lg font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {lang === 'en' ? 'Who is responsible?' : 'کس کے ذمہ کیا کام ہے؟'}
             </h3>
             <button onClick={() => onNavigate('tasks')} className="text-sm text-primary hover:underline flex items-center gap-1">
                {lang === 'en' ? 'View All' : 'سب دیکھیں'} <ArrowRight className="w-3 h-3" />
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {Object.keys(tasksByAssignee).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <CheckSquare className="w-8 h-8 mb-2 opacity-50" />
                   <p className="text-sm">No pending tasks</p>
                </div>
             ) : (
                Object.entries(tasksByAssignee).map(([person, tasks], idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {person.charAt(0).toUpperCase()}
                             </div>
                             <span className="font-bold text-slate-700 text-sm">{person}</span>
                        </div>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            {tasks.length} Pending
                        </span>
                    </div>
                    <div className="p-2 bg-white">
                        <ul className="space-y-2">
                            {tasks.map(t => (
                                <li key={t.id} className="text-sm text-slate-600 flex items-start gap-2 p-1 hover:bg-slate-50 rounded">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                        t.priority === 'High' ? 'bg-red-500' : 'bg-amber-400'
                                    }`} />
                                    <span className="leading-snug">{t.name}</span>
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 mt-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <span className="text-xl">✨</span> AI Budget & Event Analysis
        </h3>
        {loadingAi ? (
            <div className="flex items-center gap-2 text-indigo-700">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p>Analyzing costs and tasks...</p>
            </div>
        ) : (
            <div className="prose prose-indigo text-indigo-800 text-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{aiAnalysis}</pre>
            </div>
        )}
      </div>
    </div>
  );
};
    
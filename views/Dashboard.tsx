
import React, { useEffect, useState } from 'react';
import { AppData, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyzeBudget } from '../services/geminiService';
import { Users, DollarSign, CheckSquare, Calendar, Gift, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

interface Props {
  data: AppData;
  lang: Language;
  onNavigate: (view: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  const tasksByAssignee = pendingTasks.reduce((acc, task) => {
    acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const genderData = [
    { name: 'Male', value: data.guests.filter(g => g.gender === 'Male').length },
    { name: 'Female', value: data.guests.filter(g => g.gender === 'Female').length },
    { name: 'Family', value: data.guests.filter(g => g.gender === 'Family').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-primary to-purple-800 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className={`text-xl font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Welcome to your Wedding Manager' : 'شادی مینیجر میں خوش آمدید'}
          </h2>
          <p className="text-white/80 mt-1">
            {lang === 'en' ? 'Plan your Mangni, Mehndi, Barat & Walima with ease.' : 'منگنی، مہندی، بارات اور ولیمہ کی منصوبہ بندی آسانی سے کریں۔'}
          </p>
        </div>
        <button 
          onClick={() => onNavigate('guide')}
          className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors shadow-sm"
        >
          {lang === 'en' ? 'View Wedding Guide' : 'رسم و رواج گائیڈ'}
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

      {/* Financial Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                {lang === 'en' ? 'Financial Overview (Vendors)' : 'مالیاتی جائزہ (وینڈرز)'}
              </h3>
              <button onClick={() => onNavigate('vendors')} className="text-sm text-primary hover:underline">
                {lang === 'en' ? 'Manage Vendors →' : 'تفصیلات دیکھیں →'}
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                 <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Cost</span>
                 </div>
                 <p className="text-2xl font-bold text-slate-800">Rs {totalVendorCost.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                 <div className="flex items-center gap-2 mb-1 text-green-700">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Paid</span>
                 </div>
                 <p className="text-2xl font-bold text-green-700">Rs {totalPaid.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                 <div className="flex items-center gap-2 mb-1 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Outstanding</span>
                 </div>
                 <p className="text-2xl font-bold text-red-700">Rs {totalOutstanding.toLocaleString()}</p>
              </div>
           </div>

           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.vendors}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="paidAmount" stackId="a" fill="#059669" name="Paid" />
                  <Bar dataKey="cost" stackId="b" fill="#E5E7EB" name="Total Cost" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Task Responsibility Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-lg font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {lang === 'en' ? 'Task Responsibility' : 'ذمہ داریاں'}
             </h3>
             <button onClick={() => onNavigate('tasks')} className="text-sm text-primary hover:underline">
                {lang === 'en' ? 'View All →' : 'سب دیکھیں →'}
              </button>
          </div>
          
          <div className="flex-1 overflow-auto">
             {Object.keys(tasksByAssignee).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <CheckSquare className="w-8 h-8 mb-2 opacity-50" />
                   <p className="text-sm">No pending tasks</p>
                </div>
             ) : (
                <div className="space-y-3">
                   {Object.entries(tasksByAssignee).map(([person, count], idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                               {person.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-700">{person}</span>
                         </div>
                         <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            {count} Pending
                         </span>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Guest Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className={`text-lg font-bold mb-4 text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Guest Mix' : 'مہمانوں کی تقسیم'}
          </h3>
          <div className="h-64 flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-600 mt-2">
            {genderData.map((d, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <span className="text-xl">✨</span> AI Insights
          </h3>
          {loadingAi ? (
             <p className="text-indigo-700 animate-pulse">Analyzing wedding data...</p>
          ) : (
            <div className="prose prose-indigo text-indigo-800 text-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{aiAnalysis}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

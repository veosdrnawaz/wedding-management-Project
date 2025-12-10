'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Shirt, 
  CreditCard, 
  CheckSquare, 
  Menu,
  X,
  BookOpen,
  Gift
} from 'lucide-react';

import { AppData, Language, NavItem, RSVPSstatus } from '@/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Dashboard } from './views/Dashboard';
import { GuestManager } from './views/GuestManager';
import { Guide } from './views/Guide';
import { GiftManager } from './views/GiftManager';
import { EventManager } from './views/EventManager';
import { VendorManager } from './views/VendorManager';
import { TaskManager } from './views/TaskManager';
import { GeminiAssistant } from './GeminiAssistant';

// Initial data adapted for Pakistani wedding context
const initialData: AppData = {
  guests: [
    { id: '1', name: 'Chacha Bashir', village: 'Lahore', phone: '03001234567', rsvp: RSVPSstatus.ACCEPTED, gender: 'Family', events: [] },
    { id: '2', name: 'Phupho Nasreen', village: 'Faisalabad', phone: '03007654321', rsvp: RSVPSstatus.PENDING, gender: 'Family', events: [] },
    { id: '3', name: 'Ahmed (Colleague)', village: 'Islamabad', phone: '03211234567', rsvp: RSVPSstatus.ACCEPTED, gender: 'Male', events: [] }
  ],
  events: [
    { id: '0', name: 'Mangni Ceremony', type: 'Mangni', date: '2023-11-15', venue: 'Home', budget: 100000 },
    { id: '1', name: 'Mehndi Night', type: 'Mehndi', date: '2023-12-24', venue: 'Home Lawn / Marquee', budget: 300000 },
    { id: '2', name: 'Barat', type: 'Barat', date: '2023-12-25', venue: 'Pearl Continental', budget: 1500000 },
    { id: '3', name: 'Walima', type: 'Walima', date: '2023-12-26', venue: 'Dynasty Hall', budget: 1200000 }
  ],
  vendors: [
    { id: '1', name: 'Spice Catering', serviceType: 'Catering (Deg)', cost: 500000, paidAmount: 100000, contact: '0300...' },
    { id: '2', name: 'Ali Photography', serviceType: 'Photography', cost: 80000, paidAmount: 20000, contact: '0321...' }
  ],
  tasks: [
    { id: '1', name: 'Book Qari Sahab for Nikkah', priority: 'High', assignedTo: 'Abba Jaan', completed: false },
    { id: '2', name: 'Buy Mithai for Nikkah Distribution', priority: 'Medium', assignedTo: 'Brother', completed: false },
    { id: '3', name: 'Arrange Dholak for Mehndi', priority: 'Low', assignedTo: 'Cousins', completed: true },
    { id: '4', name: 'Buy Rings for Mangni', priority: 'High', assignedTo: 'Ammi', completed: true }
  ],
  suits: [],
  gifts: [
    { id: '1', guestName: 'Chacha Bashir', amount: 5000, type: 'Salami', event: 'Barat', notes: 'Given on stage' },
    { id: '2', guestName: 'Phupho Nasreen', amount: 10000, type: 'Nyoondrah', event: 'Mehndi', notes: 'Recorded in register' }
  ]
};

const WeddingApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AppData>(initialData);
  const [currentView, setCurrentView] = useState('dashboard');
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('weddingData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('weddingData', JSON.stringify(data));
    }
  }, [data, mounted]);

  const navItems: NavItem[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelUr: 'ڈیش بورڈ', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'guide', labelEn: 'Wedding Guide', labelUr: 'رسم و رواج گائیڈ', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'guests', labelEn: 'Guests', labelUr: 'مہمان', icon: <Users className="w-5 h-5" /> },
    { id: 'gifts', labelEn: 'Salami / Gifts', labelUr: 'سلامی / تحائف', icon: <Gift className="w-5 h-5" /> },
    { id: 'events', labelEn: 'Events', labelUr: 'تقریبات', icon: <Calendar className="w-5 h-5" /> },
    { id: 'vendors', labelEn: 'Vendors', labelUr: 'وینڈرز', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'tasks', labelEn: 'Tasks', labelUr: 'کام', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'wardrobe', labelEn: 'Wardrobe', labelUr: 'ملبوسات', icon: <Shirt className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={data} lang={lang} onNavigate={setCurrentView} />;
      case 'guests': return <GuestManager data={data} setData={setData} lang={lang} />;
      case 'guide': return <Guide lang={lang} data={data} setData={setData} />;
      case 'gifts': return <GiftManager data={data} setData={setData} lang={lang} />;
      case 'events': return <EventManager data={data} setData={setData} lang={lang} />;
      case 'vendors': return <VendorManager data={data} setData={setData} lang={lang} />;
      case 'tasks': return <TaskManager data={data} setData={setData} lang={lang} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2>
            <p className="text-slate-500 mt-2">The Wardrobe Manager is under construction.</p>
          </div>
        </div>
      );
    }
  };

  if (!mounted) return null;

  return (
    <div className={`flex h-screen bg-slate-50 ${lang === 'ur' ? 'font-urdu' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 ${lang === 'ur' ? 'right-0' : 'left-0'} z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (lang === 'ur' ? 'translate-x-full' : '-translate-x-full')} shadow-2xl`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
            WeddingMgr
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <div className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              <span className={`${lang === 'ur' ? 'text-lg font-medium' : 'text-sm font-medium'} tracking-wide`}>
                {lang === 'ur' ? item.labelUr : item.labelEn}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-white/10">
           <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                 A
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-semibold truncate text-white">Admin User</p>
                 <p className="text-xs text-slate-400">Wedding Organizer</p>
               </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block tracking-tight">
              {navItems.find(i => i.id === currentView)?.labelEn}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} onToggle={setLang} />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>

      <GeminiAssistant data={data} />
    </div>
  );
};

export default WeddingApp;
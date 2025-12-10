import React, { useState } from 'react';
import { AppData, Language, WeddingEvent } from '@/types';
import { Plus, Trash2, Edit2, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  lang: Language;
}

export const EventManager: React.FC<Props> = ({ data, setData, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WeddingEvent>>({
    name: '', type: 'Mehndi', date: '', venue: '', budget: 0
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setData(prev => ({
        ...prev,
        events: prev.events.map(e => e.id === editingId ? { ...e, ...formData } as WeddingEvent : e)
      }));
    } else {
      const newEvent: WeddingEvent = {
        id: Date.now().toString(),
        name: formData.name!,
        type: formData.type as any,
        date: formData.date || '',
        venue: formData.venue || '',
        budget: Number(formData.budget) || 0
      };
      setData(prev => ({ ...prev, events: [...prev.events, newEvent] }));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this event?')) {
      setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
    }
  };

  const openModal = (event?: WeddingEvent) => {
    if (event) {
      setEditingId(event.id);
      setFormData(event);
    } else {
      setEditingId(null);
      setFormData({ name: '', type: 'Mehndi', date: '', venue: '', budget: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const getEventColor = (type: string) => {
      switch(type) {
          case 'Mehndi': return 'bg-yellow-400 text-yellow-900 border-yellow-200';
          case 'Barat': return 'bg-red-500 text-white border-red-200';
          case 'Walima': return 'bg-blue-600 text-white border-blue-200';
          case 'Mangni': return 'bg-pink-400 text-white border-pink-200';
          default: return 'bg-purple-500 text-white border-purple-200';
      }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h2 className={`text-xl font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Manage Functions' : 'تقریبات کا انتظام'}
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {lang === 'en' ? 'Add Event' : 'نئی تقریب'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className={`h-3 w-full ${getEventColor(event.type).split(' ')[0]}`} />
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                                event.type === 'Mehndi' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                event.type === 'Barat' ? 'bg-red-50 text-red-700 border-red-100' :
                                event.type === 'Walima' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-purple-50 text-purple-700 border-purple-100'
                            }`}>
                                {event.type}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mt-2 line-clamp-1">{event.name}</h3>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">{event.date || 'Date not set'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="truncate">{event.venue || 'Venue not decided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>Budget: <span className="font-mono font-bold text-slate-800">PKR {event.budget.toLocaleString()}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        
        {data.events.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium">{lang === 'en' ? 'No events planned yet' : 'ابھی کوئی تقریب شامل نہیں کی گئی'}</p>
                <button onClick={() => openModal()} className="mt-4 text-primary hover:underline text-sm font-medium">Create your first event</button>
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-zoom-in">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Event' : 'Add New Event'}</h3>
            <div className="space-y-5">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Event Name</label>
                 <input 
                    className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20" 
                    placeholder="e.g. Ali's Mehndi" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                    <select 
                        className="w-full border border-slate-300 p-3 rounded-xl bg-white"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                        <option value="Mangni">Mangni (Engagement)</option>
                        <option value="Dholki">Dholki</option>
                        <option value="Mehndi">Mehndi</option>
                        <option value="Barat">Barat</option>
                        <option value="Walima">Walima</option>
                        <option value="Nikkah">Nikkah</option>
                        <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                    <input 
                        type="date"
                        className="w-full border border-slate-300 p-3 rounded-xl" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Venue</label>
                <input 
                    className="w-full border border-slate-300 p-3 rounded-xl" 
                    placeholder="Venue / Location" 
                    value={formData.venue} 
                    onChange={e => setFormData({...formData, venue: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estimated Budget</label>
                <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400 text-sm font-bold">PKR</span>
                    <input 
                        type="number"
                        className="w-full border border-slate-300 p-3 pl-12 rounded-xl font-mono" 
                        placeholder="0" 
                        value={formData.budget || ''} 
                        onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                    />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-md shadow-primary/20 transition-all active:scale-95">Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
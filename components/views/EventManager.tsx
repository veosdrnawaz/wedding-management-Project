import React, { useState } from 'react';
import { AppData, Language, WeddingEvent } from '@/types';
import { Plus, Trash2, Edit2, Calendar, MapPin, DollarSign } from 'lucide-react';

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

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h2 className={`text-xl font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Manage Functions' : 'تقریبات کا انتظام'}
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {lang === 'en' ? 'Add Event' : 'نئی تقریب'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 w-full ${
                    event.type === 'Mehndi' ? 'bg-yellow-400' :
                    event.type === 'Barat' ? 'bg-red-500' :
                    event.type === 'Walima' ? 'bg-blue-500' : 
                    event.type === 'Mangni' ? 'bg-pink-400' : 'bg-purple-500'
                }`} />
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{event.type}</span>
                            <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => openModal(event)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(event.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{event.date || 'Date not set'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{event.venue || 'Venue not decided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <span>Budget: PKR {event.budget.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        
        {data.events.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <Calendar className="w-12 h-12 mb-2 opacity-50" />
                <p>{lang === 'en' ? 'No events planned yet' : 'ابھی کوئی تقریب شامل نہیں کی گئی'}</p>
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h3>
            <div className="space-y-3">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Event Name (e.g. Ali's Mehndi)" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <select 
                className="w-full border p-2 rounded"
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
              <input 
                type="date"
                className="w-full border p-2 rounded" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Venue / Location" 
                value={formData.venue} 
                onChange={e => setFormData({...formData, venue: e.target.value})}
              />
               <input 
                type="number"
                className="w-full border p-2 rounded" 
                placeholder="Budget (PKR)" 
                value={formData.budget || ''} 
                onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
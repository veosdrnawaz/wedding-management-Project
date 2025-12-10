import React, { useState } from 'react';
import { AppData, GiftLog, Language } from '@/types';
import { Plus, Trash2, Gift, Search } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  lang: Language;
}

export const GiftManager: React.FC<Props> = ({ data, setData, lang }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftLog>>({
    guestName: '', amount: 0, type: 'Salami', event: 'Barat', notes: ''
  });

  const handleSave = () => {
    if (!formData.guestName || !formData.amount) return;

    const newGift: GiftLog = {
      id: Date.now().toString(),
      guestName: formData.guestName,
      amount: Number(formData.amount),
      type: formData.type as any,
      event: formData.event as string,
      notes: formData.notes || ''
    };

    const currentGifts = data.gifts || [];
    setData({ ...data, gifts: [...currentGifts, newGift] });
    setFormData({ guestName: '', amount: 0, type: 'Salami', event: 'Barat', notes: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      setData({ ...data, gifts: data.gifts.filter(g => g.id !== id) });
    }
  };

  const filteredGifts = (data.gifts || []).filter(g => 
    g.guestName.toLowerCase().includes(filter.toLowerCase()) || 
    g.type.toLowerCase().includes(filter.toLowerCase())
  );

  const totalReceived = (data.gifts || []).reduce((sum, g) => sum + g.amount, 0);

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-white rounded-full text-pink-500 shadow-sm border border-pink-100">
             <Gift className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-pink-600 font-bold uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Total Collected' : 'کل وصولی'}
            </p>
            <p className="text-3xl font-bold text-pink-900 tracking-tight">PKR {totalReceived.toLocaleString()}</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
                <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                    type="text"
                    placeholder={lang === 'en' ? "Search guest name..." : "مہمان کا نام تلاش کریں..."}
                    className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-full bg-slate-50"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
            >
                <Plus className="w-5 h-5" />
                {lang === 'en' ? 'Add Gift/Salami' : 'نیا اندراج'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Guest Name</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Type</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Event</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Amount (PKR)</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Notes</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGifts.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                        <Gift className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        No gifts recorded yet. Add Salami or Nyoondrah here.
                    </td>
                </tr>
              ) : filteredGifts.map(gift => (
                <tr key={gift.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-medium text-slate-900">{gift.guestName}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      gift.type === 'Salami' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {gift.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{gift.event}</td>
                  <td className="p-4 font-mono font-bold text-slate-700">{gift.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-500 italic truncate max-w-xs">{gift.notes}</td>
                  <td className="p-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(gift.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-zoom-in">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">{lang === 'en' ? 'Record Gift/Salami' : 'سلامی/تحفہ ریکارڈ کریں'}</h3>
            <div className="space-y-4">
              <input 
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20" 
                placeholder="Guest Name (e.g. Mamoo Jaan)" 
                value={formData.guestName} 
                onChange={e => setFormData({...formData, guestName: e.target.value})}
              />
              <div className="flex gap-4">
                  <select 
                    className="w-1/2 border border-slate-300 p-3 rounded-xl bg-white"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Salami">Salami</option>
                    <option value="Nyoondrah">Nyoondrah</option>
                    <option value="Gift">Gift (Items)</option>
                  </select>
                  <input 
                    type="number"
                    className="w-1/2 border border-slate-300 p-3 rounded-xl font-mono" 
                    placeholder="Amount" 
                    value={formData.amount || ''} 
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                  />
              </div>
              <select 
                className="w-full border border-slate-300 p-3 rounded-xl bg-white"
                value={formData.event}
                onChange={e => setFormData({...formData, event: e.target.value})}
              >
                <option value="Mangni">Mangni</option>
                <option value="Dholki">Dholki</option>
                <option value="Mehndi">Mehndi</option>
                <option value="Barat">Barat</option>
                <option value="Walima">Walima</option>
              </select>
              <textarea 
                className="w-full border border-slate-300 p-3 rounded-xl h-24 resize-none focus:ring-2 focus:ring-primary/20" 
                placeholder="Notes (e.g. Gave Gold Ring)" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-md shadow-primary/20 transition-all active:scale-95">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
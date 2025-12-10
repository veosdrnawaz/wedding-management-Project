import React, { useState } from 'react';
import { AppData, GiftLog, Language } from '../types';
import { Plus, Trash2, Gift, Search, Download } from 'lucide-react';

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

    // Initialize gifts array if it doesn't exist
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
    <div className="space-y-4 h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-full text-pink-600">
             <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-pink-600 font-medium">
              {lang === 'en' ? 'Total Salami/Gifts' : 'کل سلامی/تحائف'}
            </p>
            <p className="text-2xl font-bold text-pink-900">PKR {totalReceived.toLocaleString()}</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                    type="text"
                    placeholder={lang === 'en' ? "Search guest name..." : "مہمان کا نام تلاش کریں..."}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-full"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium ml-4"
            >
                <Plus className="w-4 h-4" />
                {lang === 'en' ? 'Add Gift/Salami' : 'نیا اندراج'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
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
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                        No gifts recorded yet. Add Salami or Nyoondrah here.
                    </td>
                </tr>
              ) : filteredGifts.map(gift => (
                <tr key={gift.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{gift.guestName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gift.type === 'Salami' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {gift.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{gift.event}</td>
                  <td className="p-4 font-mono font-bold text-slate-700">{gift.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-500 italic truncate max-w-xs">{gift.notes}</td>
                  <td className="p-4 flex justify-center">
                    <button onClick={() => handleDelete(gift.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">{lang === 'en' ? 'Record Gift/Salami' : 'سلامی/تحفہ ریکارڈ کریں'}</h3>
            <div className="space-y-3">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Guest Name (e.g. Mamoo Jaan)" 
                value={formData.guestName} 
                onChange={e => setFormData({...formData, guestName: e.target.value})}
              />
              <div className="flex gap-2">
                  <select 
                    className="w-1/2 border p-2 rounded"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Salami">Salami</option>
                    <option value="Nyoondrah">Nyoondrah</option>
                    <option value="Gift">Gift (Items)</option>
                  </select>
                  <input 
                    type="number"
                    className="w-1/2 border p-2 rounded" 
                    placeholder="Amount" 
                    value={formData.amount || ''} 
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                  />
              </div>
              <select 
                className="w-full border p-2 rounded"
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
                className="w-full border p-2 rounded h-20" 
                placeholder="Notes (e.g. Gave Gold Ring)" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
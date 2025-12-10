import React, { useState } from 'react';
import { AppData, Guest, Language, RSVPSstatus } from '../types';
import { Plus, Trash2, Edit2, MessageCircle, Filter, Check, X } from 'lucide-react';
import { generateInviteText } from '../services/geminiService';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  lang: Language;
}

export const GuestManager: React.FC<Props> = ({ data, setData, lang }) => {
  const [filterVillage, setFilterVillage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteModal, setInviteModal] = useState<{ isOpen: boolean, text: string, guest: string }>({ isOpen: false, text: '', guest: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Guest>>({
    name: '', village: '', phone: '', gender: 'Family', rsvp: RSVPSstatus.PENDING
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setData(prev => ({
        ...prev,
        guests: prev.guests.map(g => g.id === editingId ? { ...g, ...formData } as Guest : g)
      }));
    } else {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: formData.name!,
        village: formData.village || 'City',
        phone: formData.phone || '',
        rsvp: formData.rsvp as RSVPSstatus,
        gender: formData.gender as any,
        events: []
      };
      setData(prev => ({ ...prev, guests: [...prev.guests, newGuest] }));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this guest?')) {
      setData(prev => ({ ...prev, guests: prev.guests.filter(g => g.id !== id) }));
    }
  };

  const openModal = (guest?: Guest) => {
    if (guest) {
      setEditingId(guest.id);
      setFormData(guest);
    } else {
      setEditingId(null);
      setFormData({ name: '', village: '', phone: '', gender: 'Family', rsvp: RSVPSstatus.PENDING });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const generateInvite = async (guest: Guest) => {
    setInviteModal({ isOpen: true, text: 'Generating...', guest: guest.name });
    const eventName = data.events.length > 0 ? data.events[0].name : 'Our Wedding';
    const text = await generateInviteText(guest.name, eventName, lang);
    setInviteModal({ isOpen: true, text, guest: guest.name });
  };

  const filteredGuests = data.guests.filter(g => 
    g.name.toLowerCase().includes(filterVillage.toLowerCase()) || 
    g.village.toLowerCase().includes(filterVillage.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'en' ? "Search guest or village..." : "مہمان یا گاؤں تلاش کریں"}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-64"
            value={filterVillage}
            onChange={e => setFilterVillage(e.target.value)}
          />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {lang === 'en' ? 'Add Guest' : 'نیا مہمان'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Name</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Village</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Phone</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>Gender</th>
                <th className={`p-4 ${lang === 'ur' ? 'text-right font-urdu' : ''}`}>RSVP</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map(guest => (
                <tr key={guest.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{guest.name}</td>
                  <td className="p-4 text-slate-600">{guest.village}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{guest.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guest.gender === 'Male' ? 'bg-blue-50 text-blue-700' :
                      guest.gender === 'Female' ? 'bg-pink-50 text-pink-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {guest.gender}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guest.rsvp === RSVPSstatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                      guest.rsvp === RSVPSstatus.DECLINED ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {guest.rsvp}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => generateInvite(guest)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Generate Invite">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => openModal(guest)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Guest' : 'Add New Guest'}</h3>
            <div className="space-y-3">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Village/City" 
                value={formData.village} 
                onChange={e => setFormData({...formData, village: e.target.value})}
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Phone" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <select 
                className="w-full border p-2 rounded"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
              >
                <option value="Family">Family</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
               <select 
                className="w-full border p-2 rounded"
                value={formData.rsvp}
                onChange={e => setFormData({...formData, rsvp: e.target.value as any})}
              >
                <option value={RSVPSstatus.PENDING}>Pending</option>
                <option value={RSVPSstatus.ACCEPTED}>Accepted</option>
                <option value={RSVPSstatus.DECLINED}>Declined</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Invite for {inviteModal.guest}</h3>
            <textarea 
              readOnly 
              className={`w-full h-32 border p-3 rounded bg-slate-50 text-sm ${lang === 'ur' ? 'text-right font-urdu' : ''}`}
              value={inviteModal.text}
            />
            <div className="flex justify-between mt-4">
              <button onClick={() => setInviteModal({...inviteModal, isOpen: false})} className="text-sm text-slate-500 hover:underline">Close</button>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(inviteModal.text)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <MessageCircle className="w-4 h-4" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
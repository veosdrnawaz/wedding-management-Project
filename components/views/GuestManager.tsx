import React, { useState } from 'react';
import { AppData, Guest, Language, RSVPSstatus } from '@/types';
import { Plus, Trash2, Edit2, MessageCircle, Filter, Search, User, MapPin, Phone } from 'lucide-react';
import { generateInviteText } from '@/services/geminiService';

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
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'en' ? "Search guest or village..." : "مہمان یا گاؤں تلاش کریں"}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-full transition-shadow"
            value={filterVillage}
            onChange={e => setFilterVillage(e.target.value)}
          />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition-all active:scale-95 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          {lang === 'en' ? 'Add Guest' : 'نیا مہمان'}
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
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
              {filteredGuests.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                            <User className="w-12 h-12 mb-3 opacity-20" />
                            <p>No guests found.</p>
                        </div>
                    </td>
                </tr>
              ) : filteredGuests.map(guest => (
                <tr key={guest.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {guest.name.charAt(0)}
                    </div>
                    {guest.name}
                  </td>
                  <td className="p-4 text-slate-600">{guest.village}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs tracking-wide">{guest.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      guest.gender === 'Male' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      guest.gender === 'Female' ? 'bg-pink-50 text-pink-700 border-pink-100' :
                      'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {guest.gender}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      guest.rsvp === RSVPSstatus.ACCEPTED ? 'bg-green-50 text-green-700 border-green-100' :
                      guest.rsvp === RSVPSstatus.DECLINED ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {guest.rsvp}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => generateInvite(guest)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100" title="Generate Invite">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => openModal(guest)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 animate-zoom-in">
            <h3 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Guest' : 'Add New Guest'}</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-500 ml-1">Full Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full border border-slate-300 p-2.5 pl-10 rounded-xl" 
                        placeholder="e.g. Chacha Bashir" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-500 ml-1">Village / City</label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full border border-slate-300 p-2.5 pl-10 rounded-xl" 
                        placeholder="e.g. Lahore" 
                        value={formData.village} 
                        onChange={e => setFormData({...formData, village: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-500 ml-1">Phone Number</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full border border-slate-300 p-2.5 pl-10 rounded-xl" 
                        placeholder="0300..." 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">Gender</label>
                    <select 
                        className="w-full border border-slate-300 p-2.5 rounded-xl bg-white"
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value as any})}
                    >
                        <option value="Family">Family</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">RSVP Status</label>
                    <select 
                        className="w-full border border-slate-300 p-2.5 rounded-xl bg-white"
                        value={formData.rsvp}
                        onChange={e => setFormData({...formData, rsvp: e.target.value as any})}
                    >
                        <option value={RSVPSstatus.PENDING}>Pending</option>
                        <option value={RSVPSstatus.ACCEPTED}>Accepted</option>
                        <option value={RSVPSstatus.DECLINED}>Declined</option>
                    </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-md shadow-primary/20 transition-all active:scale-95">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-2xl animate-zoom-in">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Invite for {inviteModal.guest}
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <textarea 
                readOnly 
                className={`w-full h-32 bg-transparent border-none focus:ring-0 text-sm resize-none ${lang === 'ur' ? 'text-right font-urdu' : ''}`}
                value={inviteModal.text}
                />
            </div>
            <div className="flex justify-between items-center">
              <button onClick={() => setInviteModal({...inviteModal, isOpen: false})} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Close</button>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(inviteModal.text)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] font-medium shadow-lg shadow-green-200 transition-all active:scale-95"
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
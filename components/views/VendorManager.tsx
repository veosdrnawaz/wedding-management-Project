import React, { useState } from 'react';
import { AppData, Language, Vendor } from '@/types';
import { Plus, Trash2, Edit2, Phone, DollarSign, Wallet, AlertCircle } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  lang: Language;
}

export const VendorManager: React.FC<Props> = ({ data, setData, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '', serviceType: '', cost: 0, paidAmount: 0, contact: ''
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setData(prev => ({
        ...prev,
        vendors: prev.vendors.map(v => v.id === editingId ? { ...v, ...formData } as Vendor : v)
      }));
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        name: formData.name!,
        serviceType: formData.serviceType || 'General',
        cost: Number(formData.cost) || 0,
        paidAmount: Number(formData.paidAmount) || 0,
        contact: formData.contact || ''
      };
      setData(prev => ({ ...prev, vendors: [...prev.vendors, newVendor] }));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this vendor?')) {
      setData(prev => ({ ...prev, vendors: prev.vendors.filter(v => v.id !== id) }));
    }
  };

  const openModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingId(vendor.id);
      setFormData(vendor);
    } else {
      setEditingId(null);
      setFormData({ name: '', serviceType: '', cost: 0, paidAmount: 0, contact: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const totalCost = data.vendors.reduce((s, v) => s + v.cost, 0);
  const totalPaid = data.vendors.reduce((s, v) => s + v.paidAmount, 0);
  const totalPending = totalCost - totalPaid;

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <DollarSign className="w-24 h-24 text-blue-600" />
           </div>
           <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Total Contract Value</p>
           <p className="text-3xl font-bold text-slate-800 tracking-tight">PKR {totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Wallet className="w-24 h-24 text-green-600" />
           </div>
           <p className="text-sm text-green-700 font-bold uppercase tracking-wider mb-2">Total Paid</p>
           <p className="text-3xl font-bold text-green-800 tracking-tight">PKR {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <AlertCircle className="w-24 h-24 text-red-600" />
           </div>
           <p className="text-sm text-red-700 font-bold uppercase tracking-wider mb-2">Pending Balance</p>
           <p className="text-3xl font-bold text-red-800 tracking-tight">PKR {totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h2 className={`text-xl font-bold text-slate-800 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Vendor Payments' : 'وینڈرز اور ادائیگیاں'}
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {lang === 'en' ? 'Add Vendor' : 'نیا وینڈر'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="p-4">Vendor</th>
                <th className="p-4">Service</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-right">Total Cost</th>
                <th className="p-4 text-right">Paid</th>
                <th className="p-4 text-right">Balance</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.vendors.map(vendor => {
                const balance = vendor.cost - vendor.paidAmount;
                return (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-medium text-slate-900">{vendor.name}</td>
                  <td className="p-4 text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium">
                        {vendor.serviceType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">
                    {vendor.contact}
                  </td>
                  <td className="p-4 font-mono text-right text-slate-700">PKR {vendor.cost.toLocaleString()}</td>
                  <td className="p-4 font-mono text-right text-green-600 font-medium">PKR {vendor.paidAmount.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`font-mono font-bold ${balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        PKR {balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(vendor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(vendor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-zoom-in">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Vendor' : 'Add New Vendor'}</h3>
            <div className="space-y-5">
              <input 
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20" 
                placeholder="Vendor Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                  <input 
                    className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20" 
                    placeholder="Service Type" 
                    value={formData.serviceType} 
                    onChange={e => setFormData({...formData, serviceType: e.target.value})}
                  />
                  <input 
                    className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-primary/20" 
                    placeholder="Contact Number" 
                    value={formData.contact} 
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cost</label>
                    <input 
                        type="number"
                        className="w-full border border-slate-300 p-3 rounded-xl bg-white font-mono" 
                        value={formData.cost || ''} 
                        onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Amount</label>
                    <input 
                        type="number"
                        className="w-full border border-slate-300 p-3 rounded-xl bg-white font-mono" 
                        value={formData.paidAmount || ''} 
                        onChange={e => setFormData({...formData, paidAmount: Number(e.target.value)})}
                    />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-md shadow-primary/20 transition-all active:scale-95">Save Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
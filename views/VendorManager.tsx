import React, { useState } from 'react';
import { AppData, Language, Vendor } from '../types';
import { Plus, Trash2, Edit2, Phone, DollarSign, CheckCircle, PieChart } from 'lucide-react';

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
    <div className="space-y-4 h-full flex flex-col">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
           <p className="text-sm text-blue-600 font-medium">Total Cost</p>
           <p className="text-2xl font-bold text-blue-900">PKR {totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
           <p className="text-sm text-green-600 font-medium">Paid Amount</p>
           <p className="text-2xl font-bold text-green-900">PKR {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
           <p className="text-sm text-red-600 font-medium">Pending Balance</p>
           <p className="text-2xl font-bold text-red-900">PKR {totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h2 className={`text-xl font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {lang === 'en' ? 'Vendor Payments' : 'وینڈرز اور ادائیگیاں'}
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {lang === 'en' ? 'Add Vendor' : 'نیا وینڈر'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="p-4">Vendor</th>
                <th className="p-4">Service</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Cost</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Balance</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.vendors.map(vendor => {
                const balance = vendor.cost - vendor.paidAmount;
                const percent = vendor.cost > 0 ? (vendor.paidAmount / vendor.cost) * 100 : 0;
                return (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{vendor.name}</td>
                  <td className="p-4 text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                        {vendor.serviceType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {vendor.contact}
                  </td>
                  <td className="p-4 font-mono">PKR {vendor.cost.toLocaleString()}</td>
                  <td className="p-4 font-mono text-green-600">PKR {vendor.paidAmount.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-red-600">PKR {balance.toLocaleString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => openModal(vendor)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(vendor.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Vendor' : 'Add New Vendor'}</h3>
            <div className="space-y-3">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Vendor Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Service (e.g. Catering, Decor)" 
                value={formData.serviceType} 
                onChange={e => setFormData({...formData, serviceType: e.target.value})}
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Contact Number" 
                value={formData.contact} 
                onChange={e => setFormData({...formData, contact: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-slate-500">Total Cost</label>
                    <input 
                        type="number"
                        className="w-full border p-2 rounded" 
                        value={formData.cost || ''} 
                        onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-500">Paid Amount</label>
                    <input 
                        type="number"
                        className="w-full border p-2 rounded" 
                        value={formData.paidAmount || ''} 
                        onChange={e => setFormData({...formData, paidAmount: Number(e.target.value)})}
                    />
                </div>
              </div>
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
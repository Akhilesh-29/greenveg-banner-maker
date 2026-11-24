import React, { useState } from 'react';
import { Store, Upload, X, Check, Phone, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { saveStoredShopProfile } from '../utils/storage';

export const ShopProfileModal = ({ isOpen, onClose, shopProfile, setShopProfile }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({ ...shopProfile });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, logoUrl: event.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setShopProfile(formData);
    saveStoredShopProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Shop Profile & Branding
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saved in your browser for all current and future banners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Logo & Shop Name */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center text-3xl shrink-0">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>🏪</span>
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer text-xs font-bold">
                <Upload className="w-4 h-4 mr-1" /> Change
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>

            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Shop / Store Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sri Krishna Fresh Mart"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoUrl: '' })}
                  className="text-xs text-red-500 hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove logo
                </button>
              )}
            </div>
          </div>

          {/* Shop Tagline */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Shop Tagline / Slogan
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Fresh Fruits, Vegetables & Pure Groceries"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Phone / WhatsApp Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 98450 12345"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Store Address / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Main Market Road, Near City Bus Stand"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Visibility Toggles on Banner */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Banner Visibility Options
            </h4>

            {[
              { key: 'showShopHeader', label: 'Show Shop Header Bar on Top' },
              { key: 'showShopFooter', label: 'Show Shop Footer Bar on Bottom' },
              { key: 'showPhone', label: 'Show Phone / WhatsApp Number' },
              { key: 'showAddress', label: 'Show Shop Address' },
              { key: 'showHomeDeliveryBadge', label: 'Show "Free Home Delivery" Badge' }
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {toggle.label}
                </span>
                <input
                  type="checkbox"
                  checked={formData[toggle.key]}
                  onChange={(e) => setFormData({ ...formData, [toggle.key]: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-sm transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Shop Profile
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { PRODUCT_CATALOG } from '../constants/catalog';
import { getAssetUrl } from '../utils/assetHelper';

export const ImagePickerModal = ({ isOpen, onClose, onSelect, currentImage, currentEmoji }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'upload' | 'emojis'
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Fruits', 'Vegetables', 'Greens', 'Grocery'];

  const filteredCatalog = PRODUCT_CATALOG.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onSelect({
        type: 'custom',
        customImage: event.target?.result,
        emoji: ''
      });
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 rounded-2xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Choose Real Product Photo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-definition photos of fresh fruits, vegetables and groceries
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 gap-5">
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 font-extrabold text-sm border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Real Photos Gallery (34+)</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 font-extrabold text-sm border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Own Photo</span>
          </button>
          <button
            onClick={() => setActiveTab('emojis')}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === 'emojis'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Emoji / Stickers
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search apple, tomato, onion, potato, milk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        activeCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Real Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                {filteredCatalog.map((item) => {
                  const isSelected = currentImage === item.image;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect({
                          type: 'custom',
                          customImage: item.image,
                          emoji: '',
                          suggestedName: item.name,
                          suggestedUnit: item.unit,
                          suggestedMrp: item.mrp,
                          suggestedPrice: item.price
                        });
                        onClose();
                      }}
                      className={`relative group rounded-2xl border-2 overflow-hidden text-left transition hover:shadow-lg flex flex-col ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {/* Real Image Container */}
                      <div className="w-full h-28 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                        <img
                          src={getAssetUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
                          {item.category}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Product Name & Suggestion */}
                      <div className="p-2.5">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          ₹{item.price} <span className="text-slate-400 font-medium">/ {item.unit}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6 flex flex-col items-center justify-center py-6">
              {currentImage ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-56 h-56 rounded-2xl border-4 border-emerald-500 overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
                    <img src={getAssetUrl(currentImage)} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                      onClick={() => {
                        onSelect({ type: 'custom', customImage: '/products/apple.jpg', emoji: '' });
                        onClose();
                      }}
                      className="px-4 py-2.5 border border-red-300 dark:border-red-900/60 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-10 w-full flex flex-col items-center justify-center text-center transition bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-3">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    Click to upload product photo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    PNG, JPG, or WEBP photos from your phone camera or computer.
                  </p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          )}

          {activeTab === 'emojis' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
              {filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect({
                      type: 'emoji',
                      emoji: item.emoji,
                      customImage: '',
                      suggestedName: item.name,
                      suggestedUnit: item.unit,
                      suggestedMrp: item.mrp,
                      suggestedPrice: item.price
                    });
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <span className="text-4xl filter drop-shadow">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-2 truncate w-full text-center">
                    {item.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

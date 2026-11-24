import React, { useState } from 'react';
import { Plus, Trash2, Tag, Percent, Sparkles, RefreshCw, Image, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { UNITS } from '../constants/catalog';
import { TRANSLATIONS } from '../constants/localization';
import { getAssetUrl } from '../utils/assetHelper';
import { findLocalPhoto, searchInternetPhotos } from '../utils/photoSearch';

export const FormEditor = ({
  mode,
  singleProduct,
  setSingleProduct,
  multiItems,
  setMultiItems,
  language,
  currency,
  onOpenImagePicker
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [photoMatchMessage, setPhotoMatchMessage] = useState('');
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Single product savings calculation
  const mrp = Number(singleProduct.mrp) || 0;
  const price = Number(singleProduct.price) || 0;
  const hasSavings = mrp > price && mrp > 0;
  const saveAmt = hasSavings ? mrp - price : 0;
  const savePct = hasSavings ? Math.round((saveAmt / mrp) * 100) : 0;

  // AUTO-FETCH REAL PHOTO ON TYPING
  const handleNameChange = (newName) => {
    setSingleProduct((prev) => ({ ...prev, name: newName }));

    // 1. Instant check against 60+ local photos
    const localMatch = findLocalPhoto(newName);
    if (localMatch) {
      setSingleProduct((prev) => ({
        ...prev,
        name: newName,
        customImage: localMatch,
        emoji: ''
      }));
      setPhotoMatchMessage(`✨ Auto-matched photo for "${newName}"`);
      return;
    }

    // 2. If no local match and user typed 3+ chars, debounced web lookup
    if (newName.trim().length >= 3) {
      setIsSearchingOnline(true);
      setPhotoMatchMessage(`🔍 Searching web photo for "${newName}"...`);

      clearTimeout(window._autoFetchTimer);
      window._autoFetchTimer = setTimeout(async () => {
        const results = await searchInternetPhotos(newName);
        setIsSearchingOnline(false);
        if (results && results.length > 0) {
          setSingleProduct((prev) => ({
            ...prev,
            customImage: results[0].url,
            emoji: ''
          }));
          setPhotoMatchMessage(`🌐 Auto-fetched photo for "${results[0].title}" from internet`);
        } else {
          setPhotoMatchMessage('');
        }
      }, 700);
    } else {
      setPhotoMatchMessage('');
    }
  };

  // Multi item handlers
  const handleAddItem = () => {
    if (multiItems.length >= 12) {
      alert('Maximum 12 items allowed for optimal board layout');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: 'Fresh Cherry',
      emoji: '',
      customImage: 'products/cherry.jpg',
      unit: '500 g',
      mrp: 180,
      price: 139
    };
    setMultiItems([...multiItems, newItem]);
  };

  const handleUpdateItem = (id, field, value) => {
    if (field === 'name') {
      const localMatch = findLocalPhoto(value);
      setMultiItems(
        multiItems.map((item) =>
          item.id === id
            ? {
                ...item,
                name: value,
                ...(localMatch && { customImage: localMatch, emoji: '' })
              }
            : item
        )
      );

      // Web fallback if no local match
      if (!localMatch && value.trim().length >= 3) {
        clearTimeout(window[`_itemTimer_${id}`]);
        window[`_itemTimer_${id}`] = setTimeout(async () => {
          const results = await searchInternetPhotos(value);
          if (results && results.length > 0) {
            setMultiItems((prev) =>
              prev.map((it) =>
                it.id === id ? { ...it, customImage: results[0].url, emoji: '' } : it
              )
            );
          }
        }, 800);
      }
    } else {
      setMultiItems(
        multiItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    if (multiItems.length <= 1) {
      alert('Rate board must have at least 1 item');
      return;
    }
    setMultiItems(multiItems.filter((item) => item.id !== id));
  };

  const handleLoadSampleItems = () => {
    const samples = [
      { id: '1', name: 'Fresh Royal Apple', emoji: '', customImage: 'products/apple.jpg', unit: '1 kg', mrp: 180, price: 139 },
      { id: '2', name: 'Sweet Red Cherry', emoji: '', customImage: 'products/cherry.jpg', unit: '500 g', mrp: 220, price: 169 },
      { id: '3', name: 'Fresh Strawberry', emoji: '', customImage: 'products/strawberry.jpg', unit: '1 box', mrp: 90, price: 65 },
      { id: '4', name: 'Ripe Kiwi Fruit', emoji: '', customImage: 'products/kiwi.jpg', unit: '3 pieces', mrp: 75, price: 49 },
      { id: '5', name: 'Hass Avocado', emoji: '', customImage: 'products/avocado.jpg', unit: '1 piece', mrp: 90, price: 69 }
    ];
    setMultiItems(samples);
  };

  return (
    <div className="space-y-6">
      {mode === 'single' ? (
        /* SINGLE PRODUCT FORM */
        <div className="space-y-5">
          {/* Visual & Name Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Product Image & Name
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenImagePicker()}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Search/Browse Photos</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenImagePicker()}
                className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center text-4xl shadow-sm hover:scale-105 transition overflow-hidden shrink-0 cursor-pointer"
                title="Click to change or search photo"
              >
                {singleProduct.customImage ? (
                  <img src={getAssetUrl(singleProduct.customImage)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{singleProduct.emoji || '🍎'}</span>
                )}
              </button>

              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={singleProduct.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Type any fruit/veggie (e.g. Cherry, Apple, Avocado)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Auto-Fetch Status Pill */}
            {photoMatchMessage && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-1.5">
                  {isSearchingOnline ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <span>📸</span>
                  )}
                  <span>{photoMatchMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenImagePicker()}
                  className="text-[11px] underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
            )}

            {/* Quick Suggestions (Try typing cherry, kiwi, etc.) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Try typing:</span>
              {['Cherry', 'Strawberry', 'Avocado', 'Kiwi', 'Blueberry', 'Dragon Fruit', 'Fresh Mango'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleNameChange(name)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Unit / Quantity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quantity / Unit
            </label>
            <input
              type="text"
              value={singleProduct.unit}
              onChange={(e) => setSingleProduct({ ...singleProduct, unit: e.target.value })}
              placeholder="e.g. 1 kg, 500 g, 1 dozen, per piece"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {/* Quick unit chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {UNITS.slice(0, 8).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSingleProduct({ ...singleProduct, unit: u })}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    singleProduct.unit === u
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Prices Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {/* Market Price (Before / MRP) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Market Price ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                    {currency}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={singleProduct.mrp}
                    onChange={(e) => setSingleProduct({ ...singleProduct, mrp: e.target.value })}
                    placeholder="180"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Shown struck through</span>
              </div>

              {/* Our Price (Offer Price) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Our Offer Price ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-emerald-600 font-black text-sm">
                    {currency}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={singleProduct.price}
                    onChange={(e) => setSingleProduct({ ...singleProduct, price: e.target.value })}
                    placeholder="139"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-black text-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Shown extra large
                </span>
              </div>
            </div>

            {/* Auto Savings & Discount Badge Preview */}
            <div className="mt-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Percent className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Auto-Calculated Discount:
                  </div>
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                    {hasSavings ? (
                      <>
                        Save {currency}{saveAmt} ({savePct}% OFF)
                      </>
                    ) : (
                      'Set Market Price > Offer Price to trigger savings'
                    )}
                  </div>
                </div>
              </div>
              {hasSavings && (
                <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-full uppercase shadow">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Tagline & Offer Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Top Ribbon / Offer Heading
              </label>
              <input
                type="text"
                value={singleProduct.offerTitle || ''}
                onChange={(e) => setSingleProduct({ ...singleProduct, offerTitle: e.target.value })}
                placeholder={t.megaOffer}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Optional Tagline / Badge
              </label>
              <input
                type="text"
                value={singleProduct.tagline}
                onChange={(e) => setSingleProduct({ ...singleProduct, tagline: e.target.value })}
                placeholder="e.g. Fresh Direct From Farm / Today Only"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick Tagline Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {t.taglines?.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSingleProduct({ ...singleProduct, tagline: tag })}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* MULTI-PRODUCT RATE BOARD FORM */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Rate Board Items ({multiItems.length})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type any item (Cherry, Kiwi, Avocado) — photos auto-fetch!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleItems}
                className="px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1 border border-emerald-300 dark:border-emerald-800"
              >
                <RefreshCw className="w-3 h-3" /> Reset Sample
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            {multiItems.map((item, index) => {
              const itemMrp = Number(item.mrp) || 0;
              const itemPrice = Number(item.price) || 0;
              const itemSavings = itemMrp > itemPrice ? itemMrp - itemPrice : 0;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 relative group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center text-xs font-extrabold text-slate-400">
                      #{index + 1}
                    </span>

                    {/* Photo trigger */}
                    <button
                      type="button"
                      onClick={() => onOpenImagePicker(item.id, item.name)}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-2xl hover:scale-105 transition shrink-0 overflow-hidden"
                      title="Click to search or pick photo"
                    >
                      {item.customImage ? (
                        <img src={getAssetUrl(item.customImage)} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span>{item.emoji || '🥬'}</span>
                      )}
                    </button>

                    {/* Item Name with Auto-Photo trigger */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        placeholder="e.g. Cherry, Strawberry"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Unit / Qty */}
                    <div className="w-24">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                        placeholder="1 kg"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs text-center focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Prices & Savings */}
                  <div className="flex items-center gap-3 pl-8">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">Market:</span>
                      <div className="relative w-20">
                        <span className="absolute left-2 top-1 text-slate-400 text-xs">{currency}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={item.mrp}
                          onChange={(e) => handleUpdateItem(item.id, 'mrp', e.target.value)}
                          className="w-full pl-5 pr-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-emerald-600">Our Rate:</span>
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1 text-emerald-600 text-xs font-black">{currency}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                          className="w-full pl-5 pr-2 py-1 rounded-md border border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 text-xs font-black"
                        />
                      </div>
                    </div>

                    {itemSavings > 0 && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full ml-auto">
                        Save {currency}{itemSavings}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product Row ({multiItems.length}/12)
          </button>
        </div>
      )}
    </div>
  );
};

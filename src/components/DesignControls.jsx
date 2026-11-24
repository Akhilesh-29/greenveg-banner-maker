import React from 'react';
import { Palette, Type, Globe, Coins, Calendar, Layout, Sparkles } from 'lucide-react';
import { BANNER_TEMPLATES, FONTS_LIST, CURRENCIES } from '../constants/templates';
import { BANNER_SIZES } from '../constants/sizes';
import { LANGUAGES } from '../constants/localization';

export const DesignControls = ({
  mode,
  setMode,
  selectedTemplate,
  setSelectedTemplate,
  selectedSize,
  setSelectedSize,
  selectedFont,
  setSelectedFont,
  language,
  setLanguage,
  currency,
  setCurrency,
  showDateStamp,
  setShowDateStamp,
  dateStampText,
  setDateStampText,
  boardTitle,
  setBoardTitle,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight
}) => {
  return (
    <div className="space-y-6">
      {/* MODE TOGGLE: Single Product vs Multi-Product Rate Board */}
      <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 flex">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
            mode === 'single'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🍎</span>
          <span>Single Product Banner</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('multi')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
            mode === 'multi'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📋</span>
          <span>Multi-Item Rate Board</span>
        </button>
      </div>

      {/* BANNER SIZE SELECTOR WITH VISUAL RATIO PREVIEWS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-emerald-600" />
            <span>Banner Size & Social Format</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BANNER_SIZES.map((size) => {
            const isSelected = selectedSize.id === size.id;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                      {size.aspect}
                    </span>
                    {size.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {size.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-extrabold text-slate-800 dark:text-white text-xs leading-tight">
                    {size.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-2">
                  {size.width} × {size.height}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom dimensions input if custom is chosen */}
        {selectedSize.id === 'custom' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => {
                  const val = Number(e.target.value) || 500;
                  setCustomWidth(val);
                  setSelectedSize({ ...selectedSize, width: val });
                }}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
              />
            </div>
            <span className="text-slate-400 mt-3">×</span>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => {
                  const val = Number(e.target.value) || 500;
                  setCustomHeight(val);
                  setSelectedSize({ ...selectedSize, height: val });
                }}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* READY TEMPLATES SELECTOR (10 TEMPLATES) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>Ready Design Templates ({BANNER_TEMPLATES.length})</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
          {BANNER_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl shrink-0 shadow-inner border border-white/20 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: tmpl.previewColor }}
                >
                  ✨
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {tmpl.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FONTS, LANGUAGE & CURRENCY ROW */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Language selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Language for Labels</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  // Auto pick regional font if Kannada or Hindi chosen
                  if (lang.code === 'kn') setSelectedFont('kannada');
                  if (lang.code === 'hi') setSelectedFont('hindi');
                }}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  language === lang.code
                    ? 'border-emerald-500 bg-emerald-600 text-white font-black shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-emerald-300'
                }`}
              >
                <div className="text-xs font-extrabold">{lang.native}</div>
                <div className="text-[9px] opacity-80">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Family Picker */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Type className="w-3.5 h-3.5 text-emerald-600" />
            <span>Typography Font</span>
          </label>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {FONTS_LIST.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Symbol */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Currency Symbol</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.symbol}
                type="button"
                onClick={() => setCurrency(c.symbol)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition ${
                  currency === c.symbol
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                }`}
              >
                {c.symbol} ({c.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATE STAMP & BOARD TITLE */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Date Stamp Badge</span>
          </label>
          <input
            type="checkbox"
            checked={showDateStamp}
            onChange={(e) => setShowDateStamp(e.target.checked)}
            className="w-4 h-4 accent-emerald-600 rounded"
          />
        </div>

        {showDateStamp && (
          <div className="space-y-2">
            <input
              type="text"
              value={dateStampText}
              onChange={(e) => setDateStampText(e.target.value)}
              placeholder="e.g. Valid today: 25 Nov 2026"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              {[
                `Valid today: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
                'Today Only Special',
                'Morning Fresh 7 AM - 12 PM'
              ].map((txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => setDateStampText(txt)}
                  className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400 truncate"
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'multi' && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Rate Board Title
            </label>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="DAILY FRESH PRICE LIST"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

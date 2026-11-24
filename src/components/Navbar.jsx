import React from 'react';
import { Store, History, Moon, Sun, Download, Sparkles, Smartphone } from 'lucide-react';

export const Navbar = ({
  theme,
  toggleTheme,
  onOpenShopProfile,
  onOpenHistory,
  onOpenExport,
  historyCount = 0
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-xl font-black">
            🥬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                Shop Banner Maker
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                PWA Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              For Fruits, Veggies & Grocery Store Owners
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Shop Profile Button */}
          <button
            type="button"
            onClick={onOpenShopProfile}
            className="cursor-pointer p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Shop Profile & Branding"
          >
            <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Shop Profile</span>
          </button>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="cursor-pointer relative p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Saved Banners History"
          >
            <History className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition active:scale-95"
            title="Toggle Dark / Light UI"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="cursor-pointer ml-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </header>
  );
};

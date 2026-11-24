import React from 'react';
import { History, X, Copy, Edit3, Trash2, Calendar, Sparkles } from 'lucide-react';
import { deleteBannerFromHistory, saveBannerToHistory } from '../utils/storage';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history,
  setHistory,
  onLoadBanner
}) => {
  if (!isOpen) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this banner from recent history?')) {
      const updated = deleteBannerFromHistory(id);
      setHistory(updated);
    }
  };

  const handleDuplicate = (item, e) => {
    e.stopPropagation();
    const cloned = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    const updated = saveBannerToHistory(cloned);
    setHistory(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Recent Banners History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} saved banner{history.length === 1 ? '' : 's'}
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-3 text-slate-400">
                🎨
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                No saved banners yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                When you download or save a banner, it will automatically appear here for 1-click re-editing or duplicating!
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onLoadBanner(item);
                  onClose();
                }}
                className="group p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex gap-3 items-center"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{item.emoji || '🍎'}</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.mode === 'multi' ? 'Rate Board' : 'Single'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.sizeName || '1:1 Post'}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm truncate">
                    {item.title || 'Untitled Banner'}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => handleDuplicate(item, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

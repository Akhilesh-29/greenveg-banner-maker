import React, { useState } from 'react';
import { Download, Share2, X, FileImage, FileText, Smartphone, Check, Loader2 } from 'lucide-react';
import { exportBanner, shareBanner, openWhatsAppShare } from '../utils/exportHelper';

export const ExportModal = ({
  isOpen,
  onClose,
  exportRef,
  mode,
  singleProduct,
  multiItems,
  shopProfile,
  size,
  currency,
  onAfterExport
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState('png'); // 'png' | 'jpg' | 'pdf'
  const [scale, setScale] = useState(2); // 1, 2, 3
  const [isExporting, setIsExporting] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const bannerTitle =
    mode === 'single'
      ? `${shopProfile.name || 'Offer'} - ${singleProduct.name || 'Fresh Offer'}`
      : `${shopProfile.name || 'Shop'} - Daily Rate Board`;

  const bannerText =
    mode === 'single'
      ? `🚨 *SPECIAL OFFER* from *${shopProfile.name}*!\n\n🛍️ *${singleProduct.name}* (${singleProduct.unit || '1 kg'})\n🔥 *Offer Price:* ${currency}${singleProduct.price}\n❌ *Market Price:* ~${currency}${singleProduct.mrp}~\n💰 *Save:* ${currency}${Math.max(0, (singleProduct.mrp || 0) - (singleProduct.price || 0))}\n\n📍 Visit: ${shopProfile.address || 'Store'}\n📞 Call / WhatsApp: ${shopProfile.phone || ''}`
      : `📋 *DAILY FRESH RATE LIST* from *${shopProfile.name}*!\n\n${multiItems
          .map(
            (i) =>
              `• ${i.emoji || '•'} *${i.name}* (${i.unit}): ${currency}${i.price} ~(MRP: ${currency}${i.mrp})~`
          )
          .join('\n')}\n\n📍 ${shopProfile.address || ''}\n📞 Order: ${shopProfile.phone || ''}`;

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const cleanFileName = (singleProduct.name || 'shop-banner')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      
      await exportBanner({
        element: exportRef.current,
        format,
        scale,
        filename: `${cleanFileName}-${size.aspect.replace(/[^a-z0-9]/gi, '_')}`,
        width: size.width,
        height: size.height
      });

      if (onAfterExport) onAfterExport();
      onClose();
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    setShareStatus('Preparing image...');
    try {
      const shared = await shareBanner({
        element: exportRef.current,
        title: bannerTitle,
        text: bannerText,
        filename: 'shop-offer'
      });
      if (shared) {
        if (onAfterExport) onAfterExport();
        onClose();
      } else {
        // Fallback to WhatsApp
        openWhatsAppShare({ text: bannerText, phone: shopProfile.phone });
      }
    } catch (err) {
      console.warn('Share error', err);
      openWhatsAppShare({ text: bannerText, phone: shopProfile.phone });
    } finally {
      setIsExporting(false);
      setShareStatus('');
    }
  };

  const handleWhatsAppDirect = () => {
    openWhatsAppShare({ text: bannerText, phone: shopProfile.phone });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Download & Share Banner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-resolution export for printing & WhatsApp
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'png', label: 'PNG Image', icon: FileImage, badge: 'Crisp Quality' },
                { id: 'jpg', label: 'JPG Image', icon: FileImage, badge: 'Small File' },
                { id: 'pdf', label: 'PDF Document', icon: FileText, badge: 'Print Ready' }
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-extrabold">{fmt.label}</span>
                    <span className="text-[9px] font-semibold opacity-75">{fmt.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale / Resolution Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resolution / Quality
              </label>
              <span className="text-xs font-bold text-emerald-600">
                {size.width * scale} × {size.height * scale} px
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { s: 1, label: '1x Standard', desc: 'Fast, Small' },
                { s: 2, label: '2x High-Res', desc: 'Recommended' },
                { s: 3, label: '3x Ultra HD', desc: 'Poster Print' }
              ].map((opt) => (
                <button
                  key={opt.s}
                  type="button"
                  onClick={() => setScale(opt.s)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    scale === opt.s
                      ? 'border-emerald-500 bg-emerald-600 text-white font-black'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className={`text-[10px] ${scale === opt.s ? 'text-white/80' : 'text-slate-400'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating {format.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download {format.toUpperCase()} ({scale}x)</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleNativeShare}
                className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Banner</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="py-3 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="text-base leading-none">💬</span>
                <span>WhatsApp Text</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
            💡 <strong>Shopkeeper Tip:</strong> Share directly to your WhatsApp Business catalog or broadcast list to reach hundreds of daily customers!
          </div>
        </div>

      </div>
    </div>
  );
};

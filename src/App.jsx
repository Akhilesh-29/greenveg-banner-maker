import React, { useState, useEffect, useRef } from 'react';
import {
  Navbar
} from './components/Navbar';
import { BannerCanvas } from './components/BannerCanvas';
import { FormEditor } from './components/FormEditor';
import { DesignControls } from './components/DesignControls';
import { ImagePickerModal } from './components/ImagePickerModal';
import { ShopProfileModal } from './components/ShopProfileModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';

import { BANNER_TEMPLATES, FONTS_LIST } from './constants/templates';
import { BANNER_SIZES } from './constants/sizes';
import {
  getStoredShopProfile,
  getRecentBanners,
  saveBannerToHistory,
  getStoredTheme,
  saveStoredTheme
} from './utils/storage';
import { generateThumbnail } from './utils/exportHelper';
import { Sparkles, Download, Eye, Edit3, Palette, Save } from 'lucide-react';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals & Drawers
  const [isShopProfileOpen, setIsShopProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [targetMultiItemId, setTargetMultiItemId] = useState(null);

  // Mobile Active Tab: 'edit' | 'design' | 'preview'
  const [mobileTab, setMobileTab] = useState('edit');

  // Core Banner States
  const [mode, setMode] = useState('single'); // 'single' | 'multi'
  const [selectedTemplate, setSelectedTemplate] = useState(BANNER_TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(BANNER_SIZES[0]);
  const [selectedFont, setSelectedFont] = useState('outfit');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('₹');
  const [showDateStamp, setShowDateStamp] = useState(true);
  const [dateStampText, setDateStampText] = useState(
    `Valid today: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
  );
  const [boardTitle, setBoardTitle] = useState('DAILY FRESH PRICE LIST');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);

  // Single Product State (Default Real Photo: Apple)
  const [singleProduct, setSingleProduct] = useState({
    name: 'Fresh Royal Apple',
    unit: '1 kg',
    mrp: 180,
    price: 139,
    tagline: 'Fresh Direct From Farm',
    offerTitle: 'SPECIAL OFFER',
    emoji: '',
    customImage: 'products/apple.jpg'
  });

  // Multi Product Items State (Default Real Photos)
  const [multiItems, setMultiItems] = useState([
    { id: '1', name: 'Fresh Royal Apple', emoji: '', customImage: 'products/apple.jpg', unit: '1 kg', mrp: 180, price: 139 },
    { id: '2', name: 'Farm Fresh Tomato', emoji: '', customImage: 'products/tomato.jpg', unit: '1 kg', mrp: 40, price: 24 },
    { id: '3', name: 'Fresh Pahadi Potato', emoji: '', customImage: 'products/potato.jpg', unit: '1 kg', mrp: 45, price: 32 },
    { id: '4', name: 'Nasik Red Onion', emoji: '', customImage: 'products/onion.jpg', unit: '1 kg', mrp: 55, price: 38 },
    { id: '5', name: 'Crisp Red Carrot', emoji: '', customImage: 'products/carrot.jpg', unit: '500 g', mrp: 40, price: 28 }
  ]);

  // Shop Profile & History
  const [shopProfile, setShopProfile] = useState(getStoredShopProfile);
  const [history, setHistory] = useState(getRecentBanners);

  // Capture Ref for HTML-to-Image Export
  const exportRef = useRef(null);

  // Image Picker Trigger Handler
  const handleOpenImagePicker = (multiItemId = null) => {
    setTargetMultiItemId(multiItemId);
    setIsImagePickerOpen(true);
  };

  const handleSelectVisual = (visual) => {
    if (targetMultiItemId) {
      setMultiItems((prev) =>
        prev.map((item) =>
          item.id === targetMultiItemId
            ? {
                ...item,
                emoji: visual.emoji,
                customImage: visual.customImage,
                name: visual.suggestedName ? visual.suggestedName.split('/')[0].trim() : item.name,
                unit: visual.suggestedUnit || item.unit,
                mrp: visual.suggestedMrp || item.mrp,
                price: visual.suggestedPrice || item.price
              }
            : item
        )
      );
    } else {
      setSingleProduct((prev) => ({
        ...prev,
        emoji: visual.emoji,
        customImage: visual.customImage,
        ...(visual.suggestedName && {
          name: visual.suggestedName.split('/')[0].trim(),
          unit: visual.suggestedUnit || prev.unit,
          mrp: visual.suggestedMrp || prev.mrp,
          price: visual.suggestedPrice || prev.price
        })
      }));
    }
  };

  // Save Current Banner snapshot to History
  const handleSaveToHistory = async () => {
    let thumbnail = null;
    if (exportRef.current) {
      thumbnail = await generateThumbnail(exportRef.current);
    }

    const title =
      mode === 'single'
        ? `${singleProduct.name || 'Product'} (${singleProduct.unit}) - ${currency}${singleProduct.price}`
        : `${boardTitle} (${multiItems.length} items)`;

    const bannerRecord = {
      id: Date.now().toString(),
      title,
      mode,
      singleProduct,
      multiItems,
      templateId: selectedTemplate.id,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      font: selectedFont,
      language,
      currency,
      thumbnailUrl: thumbnail,
      emoji: mode === 'single' ? singleProduct.emoji : '📋',
      createdAt: new Date().toISOString()
    };

    const updated = saveBannerToHistory(bannerRecord);
    setHistory(updated);
  };

  // Load Banner from History Drawer
  const handleLoadBanner = (item) => {
    if (item.mode) setMode(item.mode);
    if (item.singleProduct) setSingleProduct(item.singleProduct);
    if (item.multiItems) setMultiItems(item.multiItems);
    if (item.templateId) {
      const tmpl = BANNER_TEMPLATES.find((t) => t.id === item.templateId);
      if (tmpl) setSelectedTemplate(tmpl);
    }
    if (item.sizeId) {
      const sz = BANNER_SIZES.find((s) => s.id === item.sizeId);
      if (sz) setSelectedSize(sz);
    }
    if (item.font) setSelectedFont(item.font);
    if (item.language) setLanguage(item.language);
    if (item.currency) setCurrency(item.currency);
  };

  const currentFontObj = FONTS_LIST.find((f) => f.id === selectedFont) || FONTS_LIST[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* NAVBAR */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenShopProfile={() => setIsShopProfileOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        historyCount={history.length}
      />

      {/* MOBILE TABS (Visible only on mobile/small tablets) */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex gap-2">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            mobileTab === 'edit'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Product Form</span>
        </button>
        <button
          onClick={() => setMobileTab('design')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            mobileTab === 'design'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Size & Design</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Banner</span>
        </button>
      </div>

      {/* MAIN WORKSPACE: 2 COLUMNS ON DESKTOP */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6 pb-24 lg:pb-6">
        
        {/* LEFT COLUMN: CONTROLS & FORM */}
        <section className={`w-full lg:w-5/12 flex flex-col space-y-6 ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            {/* Desktop Tabs: Form vs Size/Theme */}
            <div className="hidden lg:flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setMobileTab('edit')}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  mobileTab !== 'design'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Product & Prices</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('design')}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  mobileTab === 'design'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Banner Sizes & Styles</span>
              </button>
            </div>

            {/* Display either Form or Design based on tab */}
            {mobileTab === 'design' ? (
              <DesignControls
                mode={mode}
                setMode={setMode}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                language={language}
                setLanguage={setLanguage}
                currency={currency}
                setCurrency={setCurrency}
                showDateStamp={showDateStamp}
                setShowDateStamp={setShowDateStamp}
                dateStampText={dateStampText}
                setDateStampText={setDateStampText}
                boardTitle={boardTitle}
                setBoardTitle={setBoardTitle}
                customWidth={customWidth}
                setCustomWidth={setCustomWidth}
                customHeight={customHeight}
                setCustomHeight={setCustomHeight}
              />
            ) : (
              <FormEditor
                mode={mode}
                singleProduct={singleProduct}
                setSingleProduct={setSingleProduct}
                multiItems={multiItems}
                setMultiItems={setMultiItems}
                language={language}
                currency={currency}
                onOpenImagePicker={handleOpenImagePicker}
              />
            )}

            {/* Save to History Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveToHistory}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-emerald-600" />
                <span>Save Snapshot to History</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: LIVE ZOOMABLE PREVIEW CANVAS */}
        <section
          className={`w-full lg:w-7/12 flex flex-col h-[75vh] lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
            mobileTab !== 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <BannerCanvas
            mode={mode}
            singleProduct={singleProduct}
            multiItems={multiItems}
            template={selectedTemplate}
            size={selectedSize}
            shopProfile={shopProfile}
            language={language}
            currency={currency}
            fontClass={currentFontObj.family}
            showDateStamp={showDateStamp}
            dateStampText={dateStampText}
            boardTitle={boardTitle}
            exportRef={exportRef}
          />
        </section>

      </main>

      {/* MOBILE STICKY BOTTOM BAR (Fast Tap Targets for Shopkeepers) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {mode === 'single' ? singleProduct.name : `${multiItems.length} Items Rate Board`}
          </span>
          <div className="text-lg font-black text-emerald-600 flex items-center gap-1">
            <span>{currency}{mode === 'single' ? singleProduct.price : 'Rate Board'}</span>
            {mode === 'single' && singleProduct.mrp > singleProduct.price && (
              <span className="text-xs text-slate-400 line-through">
                {currency}{singleProduct.mrp}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mobileTab !== 'preview' ? (
            <button
              onClick={() => setMobileTab('preview')}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Preview</span>
            </button>
          ) : (
            <button
              onClick={() => setMobileTab('edit')}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setIsExportOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* MODALS */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={handleSelectVisual}
        currentEmoji={singleProduct.emoji}
        currentImage={singleProduct.customImage}
      />

      <ShopProfileModal
        isOpen={isShopProfileOpen}
        onClose={() => setIsShopProfileOpen(false)}
        shopProfile={shopProfile}
        setShopProfile={setShopProfile}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        setHistory={setHistory}
        onLoadBanner={handleLoadBanner}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        exportRef={exportRef}
        mode={mode}
        singleProduct={singleProduct}
        multiItems={multiItems}
        shopProfile={shopProfile}
        size={selectedSize}
        currency={currency}
        onAfterExport={handleSaveToHistory}
      />
    </div>
  );
}

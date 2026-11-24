import React from 'react';
import { Phone, MapPin, Sparkles, Tag, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { TRANSLATIONS } from '../constants/localization';
import { getAssetUrl } from '../utils/assetHelper';

export const SingleProductLayout = ({
  product,
  template,
  shopProfile,
  language = 'en',
  currency = '₹',
  aspectRatio = '1:1',
  fontClass = 'font-outfit',
  showDateStamp = true,
  dateStampText = ''
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  const hasSavings = mrp > price && mrp > 0;
  const savingsAmount = hasSavings ? mrp - price : 0;
  const savingsPercent = hasSavings ? Math.round((savingsAmount / mrp) * 100) : 0;

  const isTall = aspectRatio === '9:16' || aspectRatio.includes('A4') || aspectRatio.includes('A5');
  const isWide = aspectRatio === '1.91:1' || aspectRatio === '16:9';

  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-hidden relative ${template.bgStyle} ${fontClass} select-none`}>
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-24 w-80 h-80 rounded-full bg-black/10 blur-xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 w-full p-8 pb-4">
        {/* Shop Header Bar */}
        {shopProfile?.showShopHeader && (
          <div className="flex items-center justify-between pb-5 border-b border-white/20 mb-4">
            <div className="flex items-center gap-4">
              {shopProfile.logoUrl ? (
                <img
                  src={shopProfile.logoUrl}
                  alt="Shop Logo"
                  className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white/40"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 font-black text-2xl shadow">
                  🏪
                </div>
              )}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-sm">
                  {shopProfile.name || 'FRESH GROCERY STORE'}
                </h1>
                {shopProfile.tagline && (
                  <p className="text-sm font-medium text-white/80 tracking-wide mt-0.5">
                    {shopProfile.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Header phone pill */}
            {shopProfile.showPhone && shopProfile.phone && (
              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-sm">
                <Phone className="w-4 h-4 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Catchy Banner Ribbon / Offer Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full uppercase tracking-wider font-black text-lg shadow-md ${template.headerRibbon}`}>
            <Sparkles className="w-5 h-5" />
            <span>{product.offerTitle || t.megaOffer}</span>
          </div>

          {/* Date stamp pill */}
          {showDateStamp && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/30 backdrop-blur-md text-white border border-white/20">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{dateStampText || t.validToday}</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN PRODUCT BODY */}
      <div className={`relative z-10 flex-1 px-8 py-2 flex ${isWide ? 'flex-row items-center gap-10' : 'flex-col items-center justify-center gap-6'}`}>
        
        {/* Product Visual & Badges Container */}
        <div className={`relative flex items-center justify-center ${isWide ? 'w-2/5' : 'w-full'}`}>
          <div className={`relative group ${isTall ? 'w-80 h-80' : isWide ? 'w-72 h-72' : 'w-72 h-72'} rounded-3xl bg-white/95 backdrop-blur-md p-4 shadow-2xl flex items-center justify-center border-4 border-white/80`}>
            {product.customImage ? (
              <img
                src={getAssetUrl(product.customImage)}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl shadow-sm"
              />
            ) : (
              <span className={`${isTall ? 'text-9xl' : 'text-8xl'} transform transition-transform hover:scale-105 select-none filter drop-shadow-lg`}>
                {product.emoji || '🍎'}
              </span>
            )}

            {/* % OFF Starburst / Floating Badge */}
            {hasSavings && savingsPercent > 0 && (
              <div className={`absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl ${template.badgeStyle} flex flex-col items-center justify-center transform rotate-6 border-2 border-white shadow-xl`}>
                <span className="text-2xl font-black leading-none">{savingsPercent}%</span>
                <span className="text-xs font-extrabold tracking-widest leading-none mt-0.5">{t.offBadge}</span>
              </div>
            )}

            {/* Direct Farm Fresh / Guarantee sticker */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3.5 py-1 rounded-full whitespace-nowrap shadow-md border border-white/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.farmFresh}</span>
            </div>
          </div>
        </div>

        {/* Product Details & Price Block */}
        <div className={`flex flex-col items-center text-center ${isWide ? 'w-3/5 items-start text-left' : 'w-full'} max-w-xl`}>
          
          {/* Optional Tagline */}
          {product.tagline && (
            <div className={`inline-block px-4 py-1.5 rounded-xl text-sm font-bold tracking-wide uppercase mb-2 ${template.taglineBadge}`}>
              ✨ {product.tagline}
            </div>
          )}

          {/* Product Name */}
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-md tracking-tight">
            {product.name || 'Fresh Apple'}
          </h2>

          {/* Unit / Qty */}
          <div className="mt-1 text-xl font-bold text-white/90 tracking-wide">
            {product.unit ? `[ ${product.unit} ]` : '[ 1 kg ]'}
          </div>

          {/* PRICE HERO CARD */}
          <div className="mt-4 w-full bg-white rounded-3xl p-6 shadow-2xl border-4 border-white/50 text-slate-900">
            <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
              
              {/* Market Price (MRP) - Strikethrough */}
              {mrp > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.marketPrice}
                  </span>
                  <div className="relative text-2xl sm:text-3xl font-extrabold text-slate-400">
                    <span className="line-through decoration-red-500 decoration-4">
                      {currency}{mrp}
                    </span>
                  </div>
                </div>
              )}

              {/* Offer Price / Our Price - EXTRA LARGE */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full mb-0.5">
                  {t.ourPrice}
                </span>
                <div className={`text-5xl sm:text-6xl font-black tracking-tight ${template.priceColor} leading-none flex items-baseline gap-0.5`}>
                  <span className="text-3xl sm:text-4xl font-extrabold">{currency}</span>
                  <span>{price}</span>
                </div>
              </div>

              {/* Auto Calculated "SAVE ₹X" Pill */}
              {hasSavings && (
                <div className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-500/40 px-4 py-2 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    {t.saveBadge}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600">
                    {currency}{savingsAmount}
                  </span>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER SECTION */}
      {shopProfile?.showShopFooter && (
        <div className={`relative z-10 w-full px-8 py-4 ${template.footerStyle} flex flex-wrap items-center justify-between gap-4 text-xs font-medium`}>
          {/* Address */}
          {shopProfile.showAddress && shopProfile.address && (
            <div className="flex items-center gap-2 max-w-sm">
              <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="line-clamp-1">{shopProfile.address}</span>
            </div>
          )}

          {/* Delivery & Ordering Callout */}
          <div className="flex items-center gap-4 ml-auto">
            {shopProfile.showHomeDeliveryBadge && (
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-emerald-300 font-bold border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.freeDelivery}</span>
              </div>
            )}

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-1.5 font-bold text-white bg-green-600 px-3.5 py-1 rounded-full shadow-sm">
                <Phone className="w-3.5 h-3.5 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
